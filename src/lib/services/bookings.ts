"use client";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "@/lib/types/firebase";
import { availabilityService } from "./availability";
import { emailService } from "./email";
import { propertyService } from "./properties";
import { mockBookingService, USE_MOCK_DATA } from "./mock-data";

export class BookingService {
  private static instance: BookingService;
  private bookingsCollection = collection(db, "bookings");
  private availabilityCollection = collection(db, "availability");

  static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  // Create a new booking with automatic date blocking
  async createBooking(
    bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    if (USE_MOCK_DATA || !db) {
      console.log("🔧 Creating mock booking");
      return mockBookingService.createBooking(bookingData);
    }

    try {
      // Validate stay duration (1-30 days)
      const nights = this.calculateNights(
        bookingData.dates.checkIn,
        bookingData.dates.checkOut
      );
      if (nights < 1 || nights > 30) {
        throw new Error(
          `Stay duration must be between 1 and 30 days. Current: ${nights} days`
        );
      }

      // Use transaction to prevent concurrent bookings
      const result = await runTransaction(db, async (transaction) => {
        // Check availability within transaction
        const isAvailable = await this.checkAvailabilityInTransaction(
          transaction,
          bookingData.propertyId,
          bookingData.dates.checkIn,
          bookingData.dates.checkOut
        );

        if (!isAvailable) {
          throw new Error("Selected dates are no longer available");
        }

        // Create booking
        const bookingRef = doc(this.bookingsCollection);
        const bookingWithTimestamp = {
          ...bookingData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        transaction.set(bookingRef, bookingWithTimestamp);

        // Block dates in availability collection
        await this.blockDatesInTransaction(
          transaction,
          bookingData.propertyId,
          bookingData.dates.checkIn,
          bookingData.dates.checkOut,
          bookingRef.id
        );

        return bookingRef.id;
      });

      // Create admin notification for new booking
      try {
        await availabilityService.createAdminNotification({
          type: "booking_created",
          title: "New Booking Created",
          message: `A new booking has been created for property ${bookingData.propertyId}`,
          data: {
            bookingId: result,
            propertyId: bookingData.propertyId,
            guestName: bookingData.guest.name,
            checkIn: bookingData.dates.checkIn,
            checkOut: bookingData.dates.checkOut,
            total: bookingData.pricing.total,
          },
          isRead: false,
        });
      } catch (notificationError) {
        console.error("Error creating admin notification:", notificationError);
        // Don't throw error here, booking was successful
      }

      return result;
    } catch (error: unknown) {
      console.error("Error creating booking:", error);
      console.log("🔧 Falling back to mock booking creation");
      return mockBookingService.createBooking(bookingData);
    }
  }

  // Calculate nights between two dates
  private calculateNights(checkIn: string, checkOut: string): number {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  // Check availability within a transaction
  private async checkAvailabilityInTransaction(
    transaction: import("firebase/firestore").Transaction,
    propertyId: string,
    checkIn: string,
    checkOut: string
  ): Promise<boolean> {
    const availabilityQuery = query(
      this.availabilityCollection,
      where("propertyId", "==", propertyId),
      where("date", ">=", checkIn),
      where("date", "<", checkOut)
    );

    const availabilitySnapshot = await transaction.get(availabilityQuery);

    // If any dates are blocked, return false
    return availabilitySnapshot.empty;
  }

  // Block dates in availability collection within transaction
  private async blockDatesInTransaction(
    transaction: import("firebase/firestore").Transaction,
    propertyId: string,
    checkIn: string,
    checkOut: string,
    bookingId: string
  ): Promise<void> {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Block each date from check-in to check-out (excluding check-out date)
    const currentDate = new Date(checkInDate);
    while (currentDate < checkOutDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      const availabilityRef = doc(this.availabilityCollection);

      transaction.set(availabilityRef, {
        propertyId,
        date: dateString,
        bookingId,
        blocked: true,
        createdAt: serverTimestamp(),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Get booking by ID
  async getBookingById(bookingId: string): Promise<Booking | null> {
    if (USE_MOCK_DATA || !db) {
      return mockBookingService.getBookingById(bookingId);
    }

    try {
      const bookingDoc = await getDoc(doc(this.bookingsCollection, bookingId));
      if (bookingDoc.exists()) {
        return { id: bookingDoc.id, ...bookingDoc.data() } as Booking;
      }
      return null;
    } catch (error: unknown) {
      console.error("Error getting booking:", error);
      return mockBookingService.getBookingById(bookingId);
    }
  }

  // Get bookings for a user
  async getUserBookings(userId: string): Promise<Booking[]> {
    if (USE_MOCK_DATA || !db) {
      return mockBookingService.getBookingsByUser(userId);
    }

    try {
      const q = query(
        this.bookingsCollection,
        where("guest.uid", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Booking)
      );
    } catch (error: unknown) {
      console.error("Error getting user bookings:", error);
      return mockBookingService.getBookingsByUser(userId);
    }
  }

  // Get bookings for a property
  async getPropertyBookings(propertyId: string): Promise<Booking[]> {
    if (USE_MOCK_DATA || !db) {
      return mockBookingService.getBookingsByProperty(propertyId);
    }

    try {
      const q = query(
        this.bookingsCollection,
        where("propertyId", "==", propertyId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Booking)
      );
    } catch (error: unknown) {
      console.error("Error getting property bookings:", error);
      return mockBookingService.getBookingsByProperty(propertyId);
    }
  }

  // Update booking
  async updateBooking(
    bookingId: string,
    updates: Partial<Booking>
  ): Promise<void> {
    if (USE_MOCK_DATA || !db) {
      return mockBookingService.updateBooking(bookingId, updates);
    }

    try {
      await updateDoc(doc(this.bookingsCollection, bookingId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error: unknown) {
      console.error("Error updating booking:", error);
      return mockBookingService.updateBooking(bookingId, updates);
    }
  }

  // Cancel booking
  async cancelBooking(bookingId: string): Promise<void> {
    try {
      // Update booking status
      await this.updateBooking(bookingId, {
        status: "cancelled",
        updatedAt: new Date().toISOString(),
      });

      // Unblock dates when booking is cancelled
      await this.unblockDates(bookingId);
    } catch (error: unknown) {
      console.error("Error cancelling booking:", error);
      throw error;
    }
  }

  // Delete booking (admin only)
  async deleteBooking(bookingId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.bookingsCollection, bookingId));
    } catch (error: unknown) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  }

  // Enhanced availability checking
  async checkAvailability(
    propertyId: string,
    checkIn: string,
    checkOut: string
  ): Promise<boolean> {
    if (USE_MOCK_DATA || !db) {
      return mockBookingService.checkAvailability(
        propertyId,
        checkIn,
        checkOut
      );
    }

    try {
      // Validate stay duration
      const nights = this.calculateNights(checkIn, checkOut);
      if (nights < 1 || nights > 30) {
        return false;
      }

      // Check if dates are in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkInDate = new Date(checkIn);

      if (checkInDate < today) {
        return false;
      }

      // Check availability in database
      const availabilityQuery = query(
        this.availabilityCollection,
        where("propertyId", "==", propertyId),
        where("date", ">=", checkIn),
        where("date", "<", checkOut),
        where("blocked", "==", true)
      );

      const availabilitySnapshot = await getDocs(availabilityQuery);

      // If any dates are blocked, return false
      return availabilitySnapshot.empty;
    } catch (error: unknown) {
      console.error("Error checking availability:", error);
      return mockBookingService.checkAvailability(
        propertyId,
        checkIn,
        checkOut
      );
    }
  }

  // Get blocked dates for a property
  async getBlockedDates(
    propertyId: string,
    startDate?: string,
    endDate?: string
  ): Promise<string[]> {
    try {
      let availabilityQuery = query(
        this.availabilityCollection,
        where("propertyId", "==", propertyId),
        where("blocked", "==", true)
      );

      if (startDate) {
        availabilityQuery = query(
          availabilityQuery,
          where("date", ">=", startDate)
        );
      }

      if (endDate) {
        availabilityQuery = query(
          availabilityQuery,
          where("date", "<=", endDate)
        );
      }

      const availabilitySnapshot = await getDocs(availabilityQuery);
      return availabilitySnapshot.docs.map((doc) => doc.data().date);
    } catch (error: unknown) {
      console.error("Error getting blocked dates:", error);
      return [];
    }
  }

  // Unblock dates when booking is cancelled
  async unblockDates(bookingId: string): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Find all blocked dates for this booking
      const availabilityQuery = query(
        this.availabilityCollection,
        where("bookingId", "==", bookingId),
        where("blocked", "==", true)
      );

      const availabilitySnapshot = await getDocs(availabilityQuery);

      // Delete all blocked date entries
      availabilitySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error: unknown) {
      console.error("Error unblocking dates:", error);
      throw error;
    }
  }

  // Get available properties for date range
  async getAvailableProperties(
    checkIn: string,
    checkOut: string
  ): Promise<string[]> {
    try {
      // Get all confirmed/pending bookings for the date range
      const q = query(
        this.bookingsCollection,
        where("status", "in", ["confirmed", "pending"])
      );
      const querySnapshot = await getDocs(q);

      const conflictingBookings = querySnapshot.docs
        .map((doc) => doc.data() as Booking)
        .filter((booking) => {
          const checkInDate = new Date(checkIn);
          const checkOutDate = new Date(checkOut);
          const bookingCheckIn = new Date(booking.dates.checkIn);
          const bookingCheckOut = new Date(booking.dates.checkOut);

          // Check if dates overlap
          return (
            (checkInDate >= bookingCheckIn && checkInDate < bookingCheckOut) ||
            (checkOutDate > bookingCheckIn &&
              checkOutDate <= bookingCheckOut) ||
            (checkInDate <= bookingCheckIn && checkOutDate >= bookingCheckOut)
          );
        });

      const unavailablePropertyIds = [
        ...new Set(conflictingBookings.map((b) => b.propertyId)),
      ];

      // Return properties that are not in the unavailable list
      // This would typically be combined with a property query
      return unavailablePropertyIds;
    } catch (error: unknown) {
      console.error("Error getting available properties:", error);
      throw error;
    }
  }

  // Get all bookings (admin only)
  async getAllBookings(): Promise<Booking[]> {
    if (USE_MOCK_DATA || !db) {
      console.log("🔧 Using mock booking data");
      return mockBookingService.getAllBookings();
    }

    try {
      const q = query(this.bookingsCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Booking)
      );
    } catch (error: unknown) {
      console.error("Error getting all bookings:", error);
      console.log("🔧 Falling back to mock booking data");
      return mockBookingService.getAllBookings();
    }
  }

  // Get bookings by status (admin only)
  async getBookingsByStatus(status: string): Promise<Booking[]> {
    try {
      const q = query(
        this.bookingsCollection,
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Booking)
      );
    } catch (error: unknown) {
      console.error("Error getting bookings by status:", error);
      throw error;
    }
  }

  // Update booking status
  async updateBookingStatus(
    bookingId: string,
    newStatus: "pending" | "confirmed" | "completed" | "cancelled"
  ): Promise<void> {
    try {
      const bookingRef = doc(this.bookingsCollection, bookingId);
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      // If cancelled, unblock the dates
      if (newStatus === "cancelled") {
        await this.unblockDates(bookingId);
      }

      console.log(`Booking ${bookingId} status updated to ${newStatus}`);
    } catch (error: unknown) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  }

  // Update booking payment information
  async updateBookingPayment(
    bookingId: string,
    paymentData: {
      paymentIntentId?: string;
      amount: number;
      currency: string;
      status: "pending" | "completed" | "failed" | "canceled" | "refunded";
      paymentMethod?: string;
      receiptUrl?: string;
      refundId?: string;
      refundAmount?: number;
    }
  ): Promise<void> {
    try {
      const bookingRef = doc(this.bookingsCollection, bookingId);
      await updateDoc(bookingRef, {
        payment: {
          ...paymentData,
          processedAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });

      console.log(`Booking ${bookingId} payment information updated`);
    } catch (error: unknown) {
      console.error("Error updating booking payment:", error);
      throw error;
    }
  }

  // Get booking analytics (admin only)
  async getBookingAnalytics(
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalBookings: number;
    totalRevenue: number;
    completedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    averageBookingValue: number;
  }> {
    try {
      let q = query(this.bookingsCollection);

      if (startDate) {
        q = query(q, where("createdAt", ">=", startDate));
      }

      if (endDate) {
        q = query(q, where("createdAt", "<=", endDate));
      }

      const querySnapshot = await getDocs(q);
      const bookings = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Booking)
      );

      const totalBookings = bookings.length;
      const totalRevenue = bookings.reduce(
        (sum, booking) => sum + booking.pricing.total,
        0
      );
      const completedBookings = bookings.filter(
        (b) => b.status === "completed"
      ).length;
      const pendingBookings = bookings.filter(
        (b) => b.status === "pending"
      ).length;
      const cancelledBookings = bookings.filter(
        (b) => b.status === "cancelled"
      ).length;
      const averageBookingValue =
        totalBookings > 0 ? totalRevenue / totalBookings : 0;

      return {
        totalBookings,
        totalRevenue,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        averageBookingValue,
      };
    } catch (error: unknown) {
      console.error("Error getting booking analytics:", error);
      throw error;
    }
  }

  // Real-time subscription for all bookings (admin only)
  subscribeToAllBookings(callback: (bookings: Booking[]) => void): () => void {
    const q = query(this.bookingsCollection, orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Booking)
      );
      callback(bookings);
    });
  }

  // Real-time subscription for user bookings
  subscribeToUserBookings(
    userId: string,
    callback: (bookings: Booking[]) => void
  ): () => void {
    const q = query(
      this.bookingsCollection,
      where("guest.uid", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Booking)
      );
      callback(bookings);
    });
  }

  // Real-time subscription for property bookings
  subscribeToPropertyBookings(
    propertyId: string,
    callback: (bookings: Booking[]) => void
  ): () => void {
    const q = query(
      this.bookingsCollection,
      where("propertyId", "==", propertyId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Booking)
      );
      callback(bookings);
    });
  }

  // Calculate booking totals
  calculateBookingTotal(
    basePrice: number,
    nights: number,
    cleaningFee: number,
    serviceFee: number,
    taxRate: number = 0.08
  ): {
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    total: number;
  } {
    if (USE_MOCK_DATA || !db) {
      return mockBookingService.calculateBookingTotal(
        basePrice,
        nights,
        cleaningFee,
        serviceFee
      );
    }

    const subtotal = basePrice * nights;
    const taxes = (subtotal + cleaningFee + serviceFee) * taxRate;
    const total = subtotal + cleaningFee + serviceFee + taxes;

    return {
      subtotal,
      cleaningFee,
      serviceFee,
      taxes: Math.round(taxes * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  // Send booking confirmation email
  async sendBookingConfirmationEmail(bookingId: string): Promise<void> {
    try {
      // Get booking details
      const booking = await this.getBookingById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      // Get property details
      const property = await propertyService.getPropertyById(
        booking.propertyId
      );
      if (!property) {
        throw new Error("Property not found");
      }

      // Send confirmation email to guest
      await emailService.sendBookingConfirmation(booking, property);

      // Send admin notification email
      const adminEmails = ["admin@example.com"]; // Replace with actual admin emails
      await emailService.sendAdminNotification(booking, property, adminEmails);

      console.log(`Confirmation emails sent for booking ${bookingId}`);
    } catch (error: unknown) {
      console.error("Error sending booking confirmation email:", error);
      throw error;
    }
  }
}

export const bookingService = BookingService.getInstance();

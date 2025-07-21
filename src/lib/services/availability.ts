import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking, Property } from "@/lib/types/firebase";

export interface AvailabilityEntry {
  id: string;
  propertyId: string;
  date: string;
  blocked: boolean;
  reason?: "booked" | "maintenance" | "owner-use" | "manual";
  bookingId?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PricingRule {
  id: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  price: number;
  priceType: "base" | "peak" | "seasonal";
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNotification {
  id: string;
  type:
    | "booking_created"
    | "booking_cancelled"
    | "property_added"
    | "payment_received";
  title: string;
  message: string;
  data: unknown;
  isRead: boolean;
  createdAt: string;
}

export class AvailabilityService {
  private static instance: AvailabilityService;
  private availabilityCollection = collection(db, "availability");
  private pricingRulesCollection = collection(db, "pricing_rules");
  private notificationsCollection = collection(db, "admin_notifications");

  static getInstance(): AvailabilityService {
    if (!AvailabilityService.instance) {
      AvailabilityService.instance = new AvailabilityService();
    }
    return AvailabilityService.instance;
  }

  // Manual date blocking by admin
  async blockDatesManually(
    propertyId: string,
    dates: string[],
    reason: "maintenance" | "owner-use" | "manual",
    adminNotes?: string
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      for (const date of dates) {
        const availabilityRef = doc(this.availabilityCollection);
        batch.set(availabilityRef, {
          propertyId,
          date,
          blocked: true,
          reason,
          adminNotes,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      await batch.commit();
    } catch (error) {
      console.error("Error blocking dates manually:", error);
      throw error;
    }
  }

  // Unblock dates manually
  async unblockDatesManually(
    propertyId: string,
    dates: string[]
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      for (const date of dates) {
        const availabilityQuery = query(
          this.availabilityCollection,
          where("propertyId", "==", propertyId),
          where("date", "==", date)
        );

        const availabilitySnapshot = await getDocs(availabilityQuery);
        availabilitySnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }

      await batch.commit();
    } catch (error) {
      console.error("Error unblocking dates manually:", error);
      throw error;
    }
  }

  // Get availability calendar for a property
  async getAvailabilityCalendar(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<{ [date: string]: AvailabilityEntry }> {
    try {
      const availabilityQuery = query(
        this.availabilityCollection,
        where("propertyId", "==", propertyId),
        where("date", ">=", startDate),
        where("date", "<=", endDate)
      );

      const availabilitySnapshot = await getDocs(availabilityQuery);
      const calendar: { [date: string]: AvailabilityEntry } = {};

      availabilitySnapshot.docs.forEach((doc) => {
        const data = doc.data() as AvailabilityEntry;
        calendar[data.date] = { ...data, id: doc.id };
      });

      return calendar;
    } catch (error) {
      console.error("Error getting availability calendar:", error);
      throw error;
    }
  }

  // Create pricing rule
  async createPricingRule(
    ruleData: Omit<PricingRule, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const docRef = await addDoc(this.pricingRulesCollection, {
        ...ruleData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating pricing rule:", error);
      throw error;
    }
  }

  // Get pricing rules for a property
  async getPricingRules(propertyId: string): Promise<PricingRule[]> {
    try {
      const pricingQuery = query(
        this.pricingRulesCollection,
        where("propertyId", "==", propertyId),
        where("isActive", "==", true),
        orderBy("startDate", "asc")
      );

      const pricingSnapshot = await getDocs(pricingQuery);
      return pricingSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as PricingRule)
      );
    } catch (error) {
      console.error("Error getting pricing rules:", error);
      throw error;
    }
  }

  // Get price for a specific date
  async getPriceForDate(
    propertyId: string,
    date: string
  ): Promise<number | null> {
    try {
      const pricingQuery = query(
        this.pricingRulesCollection,
        where("propertyId", "==", propertyId),
        where("startDate", "<=", date),
        where("endDate", ">=", date),
        where("isActive", "==", true)
      );

      const pricingSnapshot = await getDocs(pricingQuery);

      if (pricingSnapshot.empty) {
        return null;
      }

      // If multiple rules apply, return the most recent one
      const rules = pricingSnapshot.docs.map(
        (doc) => doc.data() as PricingRule
      );
      const latestRule = rules.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      return latestRule.price;
    } catch (error) {
      console.error("Error getting price for date:", error);
      throw error;
    }
  }

  // Update pricing rule
  async updatePricingRule(
    ruleId: string,
    updates: Partial<PricingRule>
  ): Promise<void> {
    try {
      await updateDoc(doc(this.pricingRulesCollection, ruleId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating pricing rule:", error);
      throw error;
    }
  }

  // Delete pricing rule
  async deletePricingRule(ruleId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.pricingRulesCollection, ruleId));
    } catch (error) {
      console.error("Error deleting pricing rule:", error);
      throw error;
    }
  }

  // Create admin notification
  async createAdminNotification(
    notificationData: Omit<AdminNotification, "id" | "createdAt">
  ): Promise<string> {
    try {
      const docRef = await addDoc(this.notificationsCollection, {
        ...notificationData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating admin notification:", error);
      throw error;
    }
  }

  // Get admin notifications
  async getAdminNotifications(
    limit: number = 20
  ): Promise<AdminNotification[]> {
    try {
      const notificationsQuery = query(
        this.notificationsCollection,
        orderBy("createdAt", "desc")
        // Using a manual limit instead of the limit function for simplicity
      );

      const notificationsSnapshot = await getDocs(notificationsQuery);
      return notificationsSnapshot.docs.slice(0, limit).map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as AdminNotification)
      );
    } catch (error) {
      console.error("Error getting admin notifications:", error);
      throw error;
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(this.notificationsCollection, notificationId), {
        isRead: true,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Get availability statistics
  async getAvailabilityStats(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    totalDays: number;
    bookedDays: number;
    availableDays: number;
    occupancyRate: number;
    blockedDays: number;
  }> {
    try {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const totalDays = Math.ceil(
        (endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)
      );

      const availabilityQuery = query(
        this.availabilityCollection,
        where("propertyId", "==", propertyId),
        where("date", ">=", startDate),
        where("date", "<=", endDate),
        where("blocked", "==", true)
      );

      const availabilitySnapshot = await getDocs(availabilityQuery);
      const blockedDays = availabilitySnapshot.docs.length;

      // Count booked days vs manually blocked days
      const bookedDays = availabilitySnapshot.docs.filter(
        (doc) => doc.data().reason === "booked" || doc.data().bookingId
      ).length;

      const availableDays = totalDays - blockedDays;
      const occupancyRate = totalDays > 0 ? (bookedDays / totalDays) * 100 : 0;

      return {
        totalDays,
        bookedDays,
        availableDays,
        occupancyRate,
        blockedDays: blockedDays - bookedDays, // Manually blocked days
      };
    } catch (error) {
      console.error("Error getting availability stats:", error);
      throw error;
    }
  }

  // Real-time subscription for availability changes
  subscribeToAvailabilityChanges(
    propertyId: string,
    callback: (availabilityEntries: AvailabilityEntry[]) => void
  ): () => void {
    const availabilityQuery = query(
      this.availabilityCollection,
      where("propertyId", "==", propertyId),
      orderBy("date", "asc")
    );

    return onSnapshot(availabilityQuery, (snapshot) => {
      const availabilityEntries = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as AvailabilityEntry)
      );
      callback(availabilityEntries);
    });
  }

  // Real-time subscription for admin notifications
  subscribeToAdminNotifications(
    callback: (notifications: AdminNotification[]) => void
  ): () => void {
    const notificationsQuery = query(
      this.notificationsCollection,
      orderBy("createdAt", "desc")
    );

    return onSnapshot(notificationsQuery, (snapshot) => {
      const notifications = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as AdminNotification)
      );
      callback(notifications);
    });
  }
}

export const availabilityService = AvailabilityService.getInstance();

import mockData from "@/data/mock-database-full.json";
import { Property, Booking, User } from "@/lib/types/firebase";

// Type-safe access to mock data
const mockDatabase = mockData as {
  properties: Property[];
  users: User[];
  bookings: Booking[];
  availability: Array<{
    id: string;
    propertyId: string;
    date: string;
    bookingId: string;
    blocked: boolean;
    createdAt: string;
  }>;
  admin_notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    data: unknown;
    isRead: boolean;
    createdAt: string;
  }>;
};

// Simulate async operations with delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockPropertyService {
  async getAllProperties(): Promise<Property[]> {
    await delay(300); // Simulate network delay
    return mockDatabase.properties;
  }

  async getPropertyById(id: string): Promise<Property | null> {
    await delay(200);
    const property = mockDatabase.properties.find((p) => p.id === id);
    return property || null;
  }

  async createProperty(
    propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    await delay(500); // Simulate network delay

    const newProperty: Property = {
      ...propertyData,
      id: `mock_property_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock database
    mockDatabase.properties.push(newProperty);

    console.log(
      `🏠 Mock: Created property "${newProperty.title}" with ID: ${newProperty.id}`
    );
    return newProperty.id;
  }

  async getFilteredProperties(filters: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  }): Promise<Property[]> {
    await delay(500);

    let filteredProperties = [...mockDatabase.properties];

    // Filter by location
    if (filters.location && filters.location !== "Dubai") {
      filteredProperties = filteredProperties.filter(
        (property) =>
          property.location.city
            .toLowerCase()
            .includes(filters.location!.toLowerCase()) ||
          property.location.address
            .toLowerCase()
            .includes(filters.location!.toLowerCase())
      );
    }

    // Filter by guest capacity
    if (filters.guests) {
      filteredProperties = filteredProperties.filter(
        (property) => property.capacity.maxGuests >= filters.guests!
      );
    }

    // Filter by availability (check dates)
    if (filters.checkIn && filters.checkOut) {
      const checkInDate = new Date(filters.checkIn);
      const checkOutDate = new Date(filters.checkOut);

      filteredProperties = filteredProperties.filter((property) => {
        // Check if any dates in the range are blocked
        const blockedDates = mockDatabase.availability
          .filter((avail) => avail.propertyId === property.id && avail.blocked)
          .map((avail) => new Date(avail.date));

        // Generate array of dates between check-in and check-out
        const requestedDates = [];
        const currentDate = new Date(checkInDate);
        while (currentDate < checkOutDate) {
          requestedDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Check if any requested date is blocked
        return !requestedDates.some((date) =>
          blockedDates.some(
            (blockedDate) => blockedDate.toDateString() === date.toDateString()
          )
        );
      });
    }

    return filteredProperties;
  }
}

export class MockBookingService {
  async getAllBookings(): Promise<Booking[]> {
    await delay(300);
    return mockDatabase.bookings;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    await delay(200);
    const booking = mockDatabase.bookings.find((b) => b.id === id);
    return booking || null;
  }

  async getBookingsByProperty(propertyId: string): Promise<Booking[]> {
    await delay(250);
    return mockDatabase.bookings.filter((b) => b.propertyId === propertyId);
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    await delay(250);
    return mockDatabase.bookings.filter((b) => b.guest.uid === userId);
  }

  async createBooking(
    bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    await delay(400);

    const newBooking: Booking = {
      ...bookingData,
      id: `booking_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock database (in memory only)
    mockDatabase.bookings.push(newBooking);

    // Add availability blocks for confirmed bookings
    if (newBooking.status === "confirmed") {
      const checkInDate = new Date(newBooking.dates.checkIn);
      const checkOutDate = new Date(newBooking.dates.checkOut);

      const currentDate = new Date(checkInDate);
      while (currentDate < checkOutDate) {
        mockDatabase.availability.push({
          id: `avail_${Date.now()}_${currentDate.getTime()}`,
          propertyId: newBooking.propertyId,
          date: currentDate.toISOString().split("T")[0],
          bookingId: newBooking.id,
          blocked: true,
          createdAt: new Date().toISOString(),
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return newBooking.id;
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<void> {
    await delay(300);

    const bookingIndex = mockDatabase.bookings.findIndex((b) => b.id === id);
    if (bookingIndex !== -1) {
      mockDatabase.bookings[bookingIndex] = {
        ...mockDatabase.bookings[bookingIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  async checkAvailability(
    propertyId: string,
    checkIn: string,
    checkOut: string
  ): Promise<boolean> {
    await delay(200);

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Get blocked dates for this property
    const blockedDates = mockDatabase.availability
      .filter((avail) => avail.propertyId === propertyId && avail.blocked)
      .map((avail) => new Date(avail.date));

    // Check each date in the requested range
    const currentDate = new Date(checkInDate);
    while (currentDate < checkOutDate) {
      const isBlocked = blockedDates.some(
        (blockedDate) =>
          blockedDate.toDateString() === currentDate.toDateString()
      );

      if (isBlocked) {
        return false;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return true;
  }

  calculateBookingTotal(
    basePrice: number,
    nights: number,
    cleaningFee: number,
    serviceFee: number
  ) {
    const subtotal = basePrice * nights;
    const taxes = subtotal * 0.08; // 8% tax
    const total = subtotal + cleaningFee + serviceFee + taxes;

    return {
      subtotal,
      cleaningFee,
      serviceFee,
      taxes: parseFloat(taxes.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  }

  // Mock payment processing - simulates successful payment without Stripe
  async processPayment(
    bookingId: string,
    amount: number
  ): Promise<{
    success: boolean;
    paymentIntentId?: string;
    receiptUrl?: string;
    error?: string;
  }> {
    await delay(1000); // Simulate payment processing time

    // Always simulate success in mock mode
    const mockPaymentIntentId = `pi_mock_${Date.now()}`;
    const mockReceiptUrl = `https://mock-receipts.com/receipt/${mockPaymentIntentId}`;

    // Update booking with payment info
    const bookingIndex = mockDatabase.bookings.findIndex(
      (b) => b.id === bookingId
    );
    if (bookingIndex !== -1) {
      mockDatabase.bookings[bookingIndex] = {
        ...mockDatabase.bookings[bookingIndex],
        status: "confirmed",
        payment: {
          status: "completed",
          amount,
          currency: "USD",
          paymentIntentId: mockPaymentIntentId,
          paymentMethod: "card",
          receiptUrl: mockReceiptUrl,
          processedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };

      // Add availability blocks for confirmed booking
      const booking = mockDatabase.bookings[bookingIndex];
      const checkInDate = new Date(booking.dates.checkIn);
      const checkOutDate = new Date(booking.dates.checkOut);

      const currentDate = new Date(checkInDate);
      while (currentDate < checkOutDate) {
        mockDatabase.availability.push({
          id: `avail_${Date.now()}_${currentDate.getTime()}`,
          propertyId: booking.propertyId,
          date: currentDate.toISOString().split("T")[0],
          bookingId: booking.id,
          blocked: true,
          createdAt: new Date().toISOString(),
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return {
      success: true,
      paymentIntentId: mockPaymentIntentId,
      receiptUrl: mockReceiptUrl,
    };
  }
}

export class MockUserService {
  async getUserById(uid: string): Promise<User | null> {
    await delay(200);
    const user = mockDatabase.users.find((u) => u.uid === uid);
    return user || null;
  }

  async getAllUsers(): Promise<User[]> {
    await delay(300);
    return mockDatabase.users;
  }

  async createUser(
    userData: Omit<User, "createdAt" | "updatedAt">
  ): Promise<void> {
    await delay(400);

    const newUser: User = {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDatabase.users.push(newUser);
  }
}

export class MockAdminService {
  async getNotifications(): Promise<
    Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      data: unknown;
      isRead: boolean;
      createdAt: string;
    }>
  > {
    await delay(250);
    return mockDatabase.admin_notifications;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await delay(100);
    const notification = mockDatabase.admin_notifications.find(
      (n) => n.id === id
    );
    if (notification) {
      notification.isRead = true;
    }
  }
}

// Export singleton instances
export const mockPropertyService = new MockPropertyService();
export const mockBookingService = new MockBookingService();
export const mockUserService = new MockUserService();
export const mockAdminService = new MockAdminService();

// Export a flag to easily switch between mock and real services
export const USE_MOCK_DATA =
  process.env.USE_MOCK_DATA === "true" ||
  process.env.NODE_ENV === "development";

export const SKIP_STRIPE_PAYMENT =
  process.env.NODE_ENV === "development" &&
  process.env.SKIP_STRIPE_PAYMENT !== "false";

console.log(`🔧 Using ${USE_MOCK_DATA ? "MOCK" : "FIREBASE"} data services`);
console.log(
  `💳 Stripe payments: ${
    SKIP_STRIPE_PAYMENT ? "DISABLED (Mock Mode)" : "ENABLED"
  }`
);

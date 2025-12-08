export interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  propertyType: "villa" | "apartment" | "house" | "condo" | "hotel" | "other";
  capacity: {
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
  };
  amenities: string[];
  images: string[];
  pricing: {
    basePrice: number;
    currency: string;
    cleaningFee: number;
    serviceFee: number;
  };
  availability: {
    isActive: boolean;
    minimumStay: number;
    maximumStay: number;
  };
  owner: {
    uid: string;
    name: string;
    email: string;
    phone?: string;
  };
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
}

export interface Booking {
  propertyName: string;
  id: string;
  propertyId: string;
  guest: {
    uid: string;
    name: string;
    email: string;
    phone: string;
  };
  dates: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  guests: {
    adults: number;
    children: number;
    infants: number;
    total: number;
  };
  pricing: {
    basePrice: number;
    totalNights: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    total: number;
    currency: string;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment: {
    status: "pending" | "completed" | "failed" | "canceled" | "refunded";
    paymentIntentId?: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
    receiptUrl?: string;
    refundId?: string;
    refundAmount?: number;
    processedAt?: string;
  };
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  profile: {
    location: string;
    bio: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    nationality?: string;
  };
  preferences: {
    currency: string;
    language: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingCommunications?: boolean;
  };
  bookingHistory: BookingHistoryItem[];
  savedProperties?: string[];
  loyaltyPoints?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingHistoryItem {
  bookingId: string;
  propertyId: string;
  dates: {
    checkIn: string;
    checkOut: string;
  };
  status: "completed" | "cancelled";
}

export interface EmailTemplate {
  to: string;
  from: string;
  subject: string;
  html: string;
  template?: {
    name: string;
    data: Record<string, unknown>;
  };
}

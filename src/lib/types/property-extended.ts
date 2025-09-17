// Extended Property Types for Comprehensive Property Management

export interface PropertyImage {
  url: string;
  alt: string;
  caption: string;
  isPrimary: boolean;
  category: "interior" | "exterior" | "amenity" | "view";
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  neighborhood?: string;
  landmarks?: string[];
}

export interface PropertyCapacity {
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  maxAdults: number;
  maxChildren: number;
  beds: {
    king?: number;
    queen?: number;
    single?: number;
    sofa?: number;
  };
}

export interface PropertyPricing {
  basePrice: number;
  currency: string;
  cleaningFee: number;
  serviceFee: number;
  securityDeposit: number;
  extraGuestFee?: number;
  weekendMultiplier?: number;
  seasonalPricing?: {
    peak: {
      multiplier: number;
      periods: string[];
    };
    offPeak: {
      multiplier: number;
      periods: string[];
    };
  };
}

export interface PropertyAvailability {
  isActive: boolean;
  minimumStay: number;
  maximumStay: number;
  checkInTime: string;
  checkOutTime: string;
  advanceBookingDays: number;
  lastMinuteBooking: boolean;
  blockedDates: string[];
  specialAvailability: {
    instantBooking: boolean;
    sameDayBooking: boolean;
  };
}

export interface CancellationPolicy {
  type: "flexible" | "moderate" | "strict" | "super-strict";
  description: string;
  freeCancellationDays: number;
  partialRefundDays: number;
}

export interface PropertyOwner {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  responseTime?: string;
  hostSince: string;
  isSuperhost: boolean;
  languages: string[];
}

export interface PropertyRating {
  overall: number;
  cleanliness: number;
  communication: number;
  checkIn: number;
  accuracy: number;
  location: number;
  value: number;
}

export interface PropertyReview {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
}

export interface PropertyReviews {
  total: number;
  recent: PropertyReview[];
}

export interface PropertyFeatures {
  highlights: string[];
  safety: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    elevator: boolean;
    groundFloor: boolean;
  };
}

export interface NearbyAttraction {
  name: string;
  type:
    | "natural"
    | "nature"
    | "transportation"
    | "shopping"
    | "entertainment"
    | "beach"
    | "restaurant";
  distance: string;
  description: string;
}

export interface TransportationInfo {
  parking: {
    available: boolean;
    type: "free" | "paid";
    spaces: number;
    description: string;
  };
  publicTransport: {
    busStop?: string;
    metroStation?: string;
    taxiService?: string;
  };
}

export interface PropertySEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

// Main Extended Property Interface
export interface ExtendedProperty {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  location: PropertyLocation;
  propertyType: "villa" | "apartment" | "house" | "condo" | "hotel" | "other";
  propertyCategory:
    | "family-friendly"
    | "luxury"
    | "business"
    | "romantic"
    | "budget"
    | "pet-friendly";
  capacity: PropertyCapacity;
  amenities: string[];
  images: PropertyImage[];
  pricing: PropertyPricing;
  availability: PropertyAvailability;
  houseRules: string[];
  cancellationPolicy: CancellationPolicy;
  owner: PropertyOwner;
  rating: PropertyRating;
  reviews: PropertyReviews;
  features: PropertyFeatures;
  nearbyAttractions: NearbyAttraction[];
  transportation: TransportationInfo;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  verified: boolean;
  instantBook: boolean;
  superhost: boolean;
  tags: string[];
  seo: PropertySEO;
}

// Property Collection Interface
export interface PropertyCollection {
  properties: ExtendedProperty[];
  metadata: {
    totalProperties: number;
    lastUpdated: string;
    version: string;
    source: string;
    categories?: string[];
    propertyTypes?: string[];
    amenities?: string[];
  };
}

// Property Filter Interface
export interface PropertyFilters {
  location?: {
    city?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
      radius: number; // in kilometers
    };
  };
  dates?: {
    checkIn: string;
    checkOut: string;
  };
  guests?: {
    adults: number;
    children: number;
    infants: number;
  };
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
  propertyType?: string[];
  amenities?: string[];
  rating?: {
    min: number;
  };
  instantBook?: boolean;
  superhost?: boolean;
  featured?: boolean;
}

// Property Search Result Interface
export interface PropertySearchResult {
  properties: ExtendedProperty[];
  totalCount: number;
  filters: PropertyFilters;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  searchMetadata: {
    searchTime: number;
    searchId: string;
    timestamp: string;
  };
}

// Property Analytics Interface
export interface PropertyAnalytics {
  propertyId: string;
  views: {
    total: number;
    monthly: number;
    weekly: number;
    daily: number;
  };
  bookings: {
    total: number;
    confirmed: number;
    cancelled: number;
    revenue: number;
  };
  ratings: {
    average: number;
    count: number;
    distribution: {
      [key: number]: number; // rating -> count
    };
  };
  occupancy: {
    rate: number;
    totalNights: number;
    availableNights: number;
  };
  performance: {
    responseRate: number;
    responseTime: number;
    acceptanceRate: number;
  };
}

// Property Management Interface
export interface PropertyManagement {
  propertyId: string;
  status: "active" | "inactive" | "maintenance" | "suspended";
  lastUpdated: string;
  updates: {
    type: "pricing" | "availability" | "amenities" | "images" | "description";
    timestamp: string;
    changes: Record<string, any>;
  }[];
  maintenance: {
    scheduled: {
      date: string;
      type: string;
      description: string;
    }[];
    completed: {
      date: string;
      type: string;
      description: string;
      cost?: number;
    }[];
  };
  performance: {
    revenue: number;
    occupancy: number;
    rating: number;
    bookings: number;
  };
}

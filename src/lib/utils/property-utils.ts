import {
  ExtendedProperty,
  PropertyImage,
} from "@/lib/types/property-extended";

export class PropertyUtils {
  // Validate property data
  static validateProperty(property: Partial<ExtendedProperty>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Required fields validation
    if (!property.id) errors.push("Property ID is required");
    if (!property.title) errors.push("Property title is required");
    if (!property.description) errors.push("Property description is required");
    if (!property.location?.address)
      errors.push("Property address is required");
    if (!property.location?.city) errors.push("Property city is required");
    if (!property.location?.country)
      errors.push("Property country is required");
    if (!property.propertyType) errors.push("Property type is required");
    if (!property.capacity?.bedrooms)
      errors.push("Number of bedrooms is required");
    if (!property.capacity?.bathrooms)
      errors.push("Number of bathrooms is required");
    if (!property.capacity?.maxGuests)
      errors.push("Maximum guests is required");
    if (!property.pricing?.basePrice) errors.push("Base price is required");
    if (!property.amenities || property.amenities.length === 0)
      errors.push("At least one amenity is required");
    if (!property.images || property.images.length === 0)
      errors.push("At least one image is required");

    // Data type validation
    if (
      property.capacity?.bedrooms &&
      typeof property.capacity.bedrooms !== "number"
    ) {
      errors.push("Number of bedrooms must be a number");
    }
    if (
      property.capacity?.bathrooms &&
      typeof property.capacity.bathrooms !== "number"
    ) {
      errors.push("Number of bathrooms must be a number");
    }
    if (
      property.capacity?.maxGuests &&
      typeof property.capacity.maxGuests !== "number"
    ) {
      errors.push("Maximum guests must be a number");
    }
    if (
      property.pricing?.basePrice &&
      typeof property.pricing.basePrice !== "number"
    ) {
      errors.push("Base price must be a number");
    }

    // Range validation
    if (
      property.capacity?.bedrooms &&
      (property.capacity.bedrooms < 1 || property.capacity.bedrooms > 20)
    ) {
      errors.push("Number of bedrooms must be between 1 and 20");
    }
    if (
      property.capacity?.bathrooms &&
      (property.capacity.bathrooms < 1 || property.capacity.bathrooms > 20)
    ) {
      errors.push("Number of bathrooms must be between 1 and 20");
    }
    if (
      property.capacity?.maxGuests &&
      (property.capacity.maxGuests < 1 || property.capacity.maxGuests > 50)
    ) {
      errors.push("Maximum guests must be between 1 and 50");
    }
    if (
      property.pricing?.basePrice &&
      (property.pricing.basePrice < 1 || property.pricing.basePrice > 10000)
    ) {
      errors.push("Base price must be between $1 and $10,000");
    }

    // Rating validation
    if (
      property.rating?.overall &&
      (property.rating.overall < 1 || property.rating.overall > 5)
    ) {
      errors.push("Overall rating must be between 1 and 5");
    }

    // Image validation
    if (property.images) {
      property.images.forEach((image, index) => {
        if (!image.url) errors.push(`Image ${index + 1}: URL is required`);
        if (!image.alt) errors.push(`Image ${index + 1}: Alt text is required`);
        if (!image.caption)
          errors.push(`Image ${index + 1}: Caption is required`);
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Format property price
  static formatPrice(price: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  // Calculate total price for a booking
  static calculateTotalPrice(
    basePrice: number,
    nights: number,
    cleaningFee: number = 0,
    serviceFee: number = 0,
    extraGuestFee: number = 0,
    extraGuests: number = 0,
    weekendMultiplier: number = 1,
    isWeekend: boolean = false
  ): {
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    extraGuestFee: number;
    taxes: number;
    total: number;
  } {
    const subtotal = basePrice * nights;
    const finalSubtotal = isWeekend ? subtotal * weekendMultiplier : subtotal;
    const extraGuestTotal = extraGuestFee * extraGuests * nights;
    const taxes =
      (finalSubtotal + cleaningFee + serviceFee + extraGuestTotal) * 0.08; // 8% tax
    const total =
      finalSubtotal + cleaningFee + serviceFee + extraGuestTotal + taxes;

    return {
      subtotal: Math.round(finalSubtotal * 100) / 100,
      cleaningFee: Math.round(cleaningFee * 100) / 100,
      serviceFee: Math.round(serviceFee * 100) / 100,
      extraGuestFee: Math.round(extraGuestTotal * 100) / 100,
      taxes: Math.round(taxes * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  // Get primary image
  static getPrimaryImage(images: PropertyImage[]): PropertyImage | null {
    return images.find((image) => image.isPrimary) || images[0] || null;
  }

  // Get images by category
  static getImagesByCategory(
    images: PropertyImage[],
    category: string
  ): PropertyImage[] {
    return images.filter((image) => image.category === category);
  }

  // Format property address
  static formatAddress(location: ExtendedProperty["location"]): string {
    const parts = [
      location.address,
      location.city,
      location.state,
      location.country,
    ].filter(Boolean);

    return parts.join(", ");
  }

  // Get property highlights
  static getPropertyHighlights(property: ExtendedProperty): string[] {
    const highlights: string[] = [];

    // Add capacity highlights
    if (property.capacity.bedrooms >= 3) {
      highlights.push(`${property.capacity.bedrooms} bedrooms`);
    }
    if (property.capacity.maxGuests >= 6) {
      highlights.push(`Sleeps ${property.capacity.maxGuests}`);
    }

    // Add amenity highlights
    const premiumAmenities = [
      "Private Pool",
      "Gym",
      "Sauna",
      "Hot Tub",
      "Ocean View",
      "Mountain View",
      "Dam View",
    ];
    const hasPremiumAmenities = property.amenities.some((amenity) =>
      premiumAmenities.some((premium) => amenity.includes(premium))
    );

    if (hasPremiumAmenities) {
      const premiumAmenity = property.amenities.find((amenity) =>
        premiumAmenities.some((premium) => amenity.includes(premium))
      );
      if (premiumAmenity) highlights.push(premiumAmenity);
    }

    // Add rating highlight
    if (property.rating.overall >= 4.5) {
      highlights.push(`${property.rating.overall}★ rating`);
    }

    // Add superhost highlight
    if (property.superhost) {
      highlights.push("Superhost");
    }

    return highlights.slice(0, 3); // Limit to 3 highlights
  }

  // Check if property is available for dates
  static isAvailableForDates(
    property: ExtendedProperty,
    checkIn: string,
    checkOut: string
  ): boolean {
    if (!property.availability.isActive) return false;

    const today = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Check if dates are in the future
    if (checkInDate < today || checkOutDate <= checkInDate) return false;

    // Check against blocked dates
    const blockedDates = property.availability.blockedDates;
    const currentDate = new Date(checkInDate);

    while (currentDate < checkOutDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      if (blockedDates.includes(dateString)) return false;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return true;
  }

  // Get property rating display
  static getRatingDisplay(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
    );
  }

  // Format property size
  static formatPropertySize(property: ExtendedProperty): string {
    const { bedrooms, bathrooms, maxGuests } = property.capacity;
    return `${bedrooms} bed${bedrooms > 1 ? "s" : ""} • ${bathrooms} bath${
      bathrooms > 1 ? "s" : ""
    } • Sleeps ${maxGuests}`;
  }

  // Get property type display name
  static getPropertyTypeDisplay(type: string): string {
    const typeMap: Record<string, string> = {
      apartment: "Apartment",
      villa: "Villa",
      house: "House",
      condo: "Condo",
      hotel: "Hotel",
      other: "Other",
    };

    return typeMap[type] || type;
  }

  // Get property category display name
  static getPropertyCategoryDisplay(category: string): string {
    const categoryMap: Record<string, string> = {
      "family-friendly": "Family Friendly",
      luxury: "Luxury",
      business: "Business",
      romantic: "Romantic",
      budget: "Budget",
      "pet-friendly": "Pet Friendly",
    };

    return categoryMap[category] || category;
  }

  // Generate property slug
  static generatePropertySlug(property: ExtendedProperty): string {
    const title = property.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    return `${property.id}-${title}`;
  }

  // Get property distance from coordinates
  static getDistanceFromCoordinates(
    property: ExtendedProperty,
    lat: number,
    lng: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat - property.location.coordinates.lat);
    const dLon = this.deg2rad(lng - property.location.coordinates.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(property.location.coordinates.lat)) *
        Math.cos(this.deg2rad(lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in kilometers
    return Math.round(d * 10) / 10; // Round to 1 decimal place
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Sort properties by various criteria
  static sortProperties(
    properties: ExtendedProperty[],
    sortBy: "price" | "rating" | "distance" | "newest" | "popularity"
  ): ExtendedProperty[] {
    const sorted = [...properties];

    switch (sortBy) {
      case "price":
        return sorted.sort((a, b) => a.pricing.basePrice - b.pricing.basePrice);
      case "rating":
        return sorted.sort((a, b) => b.rating.overall - a.rating.overall);
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "popularity":
        return sorted.sort((a, b) => b.reviews.total - a.reviews.total);
      default:
        return sorted;
    }
  }

  // Filter properties by price range
  static filterByPriceRange(
    properties: ExtendedProperty[],
    minPrice: number,
    maxPrice: number
  ): ExtendedProperty[] {
    return properties.filter(
      (property) =>
        property.pricing.basePrice >= minPrice &&
        property.pricing.basePrice <= maxPrice
    );
  }

  // Filter properties by amenities
  static filterByAmenities(
    properties: ExtendedProperty[],
    requiredAmenities: string[]
  ): ExtendedProperty[] {
    return properties.filter((property) =>
      requiredAmenities.every((amenity) => property.amenities.includes(amenity))
    );
  }

  // Get property availability calendar
  static getAvailabilityCalendar(
    property: ExtendedProperty,
    year: number,
    month: number
  ): Array<{
    date: string;
    available: boolean;
    price?: number;
  }> {
    const daysInMonth = new Date(year, month, 0).getDate();
    const calendar: Array<{
      date: string;
      available: boolean;
      price?: number;
    }> = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateString = date.toISOString().split("T")[0];
      const isBlocked = property.availability.blockedDates.includes(dateString);
      const isPast = date < new Date();

      calendar.push({
        date: dateString,
        available: !isBlocked && !isPast && property.availability.isActive,
        price: property.pricing.basePrice,
      });
    }

    return calendar;
  }
}

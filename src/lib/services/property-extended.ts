import {
  ExtendedProperty,
  PropertyCollection,
  PropertyFilters,
  PropertySearchResult,
} from "@/lib/types/property-extended";
import propertyData from "@/data/comprehensive-properties.json";

export class ExtendedPropertyService {
  private static instance: ExtendedPropertyService;
  private properties: ExtendedProperty[] = [];

  static getInstance(): ExtendedPropertyService {
    if (!ExtendedPropertyService.instance) {
      ExtendedPropertyService.instance = new ExtendedPropertyService();
    }
    return ExtendedPropertyService.instance;
  }

  constructor() {
    this.loadProperties();
  }

  private loadProperties(): void {
    try {
      const data = propertyData as PropertyCollection;
      this.properties = data.properties;
      console.log(
        `🏠 Loaded ${this.properties.length} properties from comprehensive database`
      );
    } catch (error) {
      console.error("Error loading comprehensive properties:", error);
      this.properties = [];
    }
  }

  // Get all properties
  getAllProperties(): ExtendedProperty[] {
    return this.properties;
  }

  // Get property by ID
  getPropertyById(id: string): ExtendedProperty | null {
    return this.properties.find((property) => property.id === id) || null;
  }

  // Search properties with filters
  searchProperties(
    filters: PropertyFilters,
    page: number = 1,
    limit: number = 10
  ): PropertySearchResult {
    const startTime = Date.now();
    let filteredProperties = [...this.properties];

    // Apply location filter
    if (filters.location) {
      if (filters.location.city) {
        filteredProperties = filteredProperties.filter((property) =>
          property.location.city
            .toLowerCase()
            .includes(filters.location!.city!.toLowerCase())
        );
      }
      if (filters.location.country) {
        filteredProperties = filteredProperties.filter((property) =>
          property.location.country
            .toLowerCase()
            .includes(filters.location!.country!.toLowerCase())
        );
      }
      if (filters.location.coordinates) {
        const { lat, lng, radius } = filters.location.coordinates;
        filteredProperties = filteredProperties.filter((property) => {
          const distance = this.calculateDistance(
            lat,
            lng,
            property.location.coordinates.lat,
            property.location.coordinates.lng
          );
          return distance <= radius;
        });
      }
    }

    // Apply date filter
    if (filters.dates) {
      filteredProperties = filteredProperties.filter((property) => {
        return this.isPropertyAvailable(
          property.id,
          filters.dates!.checkIn,
          filters.dates!.checkOut
        );
      });
    }

    // Apply guest filter
    if (filters.guests) {
      const totalGuests = filters.guests.adults + filters.guests.children;
      filteredProperties = filteredProperties.filter(
        (property) => property.capacity.maxGuests >= totalGuests
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      filteredProperties = filteredProperties.filter(
        (property) =>
          property.pricing.basePrice >= filters.priceRange!.min &&
          property.pricing.basePrice <= filters.priceRange!.max
      );
    }

    // Apply property type filter
    if (filters.propertyType && filters.propertyType.length > 0) {
      filteredProperties = filteredProperties.filter((property) =>
        filters.propertyType!.includes(property.propertyType)
      );
    }

    // Apply amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      filteredProperties = filteredProperties.filter((property) =>
        filters.amenities!.every((amenity) =>
          property.amenities.includes(amenity)
        )
      );
    }

    // Apply rating filter
    if (filters.rating) {
      filteredProperties = filteredProperties.filter(
        (property) => property.rating.overall >= filters.rating!.min
      );
    }

    // Apply instant book filter
    if (filters.instantBook !== undefined) {
      filteredProperties = filteredProperties.filter(
        (property) => property.instantBook === filters.instantBook
      );
    }

    // Apply superhost filter
    if (filters.superhost !== undefined) {
      filteredProperties = filteredProperties.filter(
        (property) => property.superhost === filters.superhost
      );
    }

    // Apply featured filter
    if (filters.featured !== undefined) {
      filteredProperties = filteredProperties.filter(
        (property) => property.featured === filters.featured
      );
    }

    // Sort by rating (highest first)
    filteredProperties.sort((a, b) => b.rating.overall - a.rating.overall);

    // Apply pagination
    const totalCount = filteredProperties.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    const searchTime = Date.now() - startTime;

    return {
      properties: paginatedProperties,
      totalCount,
      filters,
      pagination: {
        page,
        limit,
        totalPages,
      },
      searchMetadata: {
        searchTime,
        searchId: `search_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Get featured properties
  getFeaturedProperties(limit: number = 6): ExtendedProperty[] {
    return this.properties
      .filter((property) => property.featured)
      .sort((a, b) => b.rating.overall - a.rating.overall)
      .slice(0, limit);
  }

  // Get properties by category
  getPropertiesByCategory(
    category: string,
    limit?: number
  ): ExtendedProperty[] {
    let filtered = this.properties.filter(
      (property) => property.propertyCategory === category
    );

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }

  // Get properties by city
  getPropertiesByCity(city: string): ExtendedProperty[] {
    return this.properties.filter((property) =>
      property.location.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  // Get similar properties
  getSimilarProperties(
    propertyId: string,
    limit: number = 3
  ): ExtendedProperty[] {
    const property = this.getPropertyById(propertyId);
    if (!property) return [];

    return this.properties
      .filter(
        (p) =>
          p.id !== propertyId &&
          (p.location.city === property.location.city ||
            p.propertyType === property.propertyType ||
            p.propertyCategory === property.propertyCategory)
      )
      .sort((a, b) => b.rating.overall - a.rating.overall)
      .slice(0, limit);
  }

  // Get properties by price range
  getPropertiesByPriceRange(
    minPrice: number,
    maxPrice: number
  ): ExtendedProperty[] {
    return this.properties.filter(
      (property) =>
        property.pricing.basePrice >= minPrice &&
        property.pricing.basePrice <= maxPrice
    );
  }

  // Get properties by amenities
  getPropertiesByAmenities(amenities: string[]): ExtendedProperty[] {
    return this.properties.filter((property) =>
      amenities.every((amenity) => property.amenities.includes(amenity))
    );
  }

  // Get property statistics
  getPropertyStatistics(): {
    totalProperties: number;
    averageRating: number;
    averagePrice: number;
    propertiesByType: Record<string, number>;
    propertiesByCategory: Record<string, number>;
    topCities: Array<{ city: string; count: number }>;
  } {
    const totalProperties = this.properties.length;
    const averageRating =
      this.properties.reduce((sum, p) => sum + p.rating.overall, 0) /
      totalProperties;
    const averagePrice =
      this.properties.reduce((sum, p) => sum + p.pricing.basePrice, 0) /
      totalProperties;

    const propertiesByType: Record<string, number> = {};
    const propertiesByCategory: Record<string, number> = {};
    const cityCount: Record<string, number> = {};

    this.properties.forEach((property) => {
      propertiesByType[property.propertyType] =
        (propertiesByType[property.propertyType] || 0) + 1;
      propertiesByCategory[property.propertyCategory] =
        (propertiesByCategory[property.propertyCategory] || 0) + 1;
      cityCount[property.location.city] =
        (cityCount[property.location.city] || 0) + 1;
    });

    const topCities = Object.entries(cityCount)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalProperties,
      averageRating: Math.round(averageRating * 10) / 10,
      averagePrice: Math.round(averagePrice * 100) / 100,
      propertiesByType,
      propertiesByCategory,
      topCities,
    };
  }

  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Check if property is available for given dates
  private isPropertyAvailable(
    propertyId: string,
    checkIn: string,
    checkOut: string
  ): boolean {
    // This is a simplified check - in a real implementation, you would check against
    // actual booking data and blocked dates
    const property = this.getPropertyById(propertyId);
    if (!property || !property.availability.isActive) {
      return false;
    }

    // Check if dates are in the future
    const today = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < today || checkOutDate <= checkInDate) {
      return false;
    }

    // Check against blocked dates
    const blockedDates = property.availability.blockedDates;
    const currentDate = new Date(checkInDate);

    while (currentDate < checkOutDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      if (blockedDates.includes(dateString)) {
        return false;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return true;
  }

  // Get available amenities across all properties
  getAllAmenities(): string[] {
    const amenitiesSet = new Set<string>();
    this.properties.forEach((property) => {
      property.amenities.forEach((amenity) => amenitiesSet.add(amenity));
    });
    return Array.from(amenitiesSet).sort();
  }

  // Get all cities
  getAllCities(): string[] {
    const citiesSet = new Set<string>();
    this.properties.forEach((property) => {
      citiesSet.add(property.location.city);
    });
    return Array.from(citiesSet).sort();
  }

  // Get all countries
  getAllCountries(): string[] {
    const countriesSet = new Set<string>();
    this.properties.forEach((property) => {
      countriesSet.add(property.location.country);
    });
    return Array.from(countriesSet).sort();
  }

  // Refresh properties data
  refreshProperties(): void {
    this.loadProperties();
  }
}

// Export singleton instance
export const extendedPropertyService = ExtendedPropertyService.getInstance();

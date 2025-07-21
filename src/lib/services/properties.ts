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
  limit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Property } from "@/lib/types/firebase";
import { mockPropertyService, USE_MOCK_DATA } from "./mock-data";

export class PropertyService {
  private static instance: PropertyService;
  private propertiesCollection = collection(db, "properties");

  static getInstance(): PropertyService {
    if (!PropertyService.instance) {
      PropertyService.instance = new PropertyService();
    }
    return PropertyService.instance;
  }

  // Create a new property
  async createProperty(
    propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    if (USE_MOCK_DATA || !db) {
      // For mock data, just return a fake ID
      return `mock_property_${Date.now()}`;
    }

    try {
      const docRef = await addDoc(this.propertiesCollection, {
        ...propertyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }

  // Get property by ID
  async getPropertyById(propertyId: string): Promise<Property | null> {
    if (USE_MOCK_DATA || !db) {
      return mockPropertyService.getPropertyById(propertyId);
    }

    try {
      const propertyDoc = await getDoc(
        doc(this.propertiesCollection, propertyId)
      );
      if (propertyDoc.exists()) {
        return { id: propertyDoc.id, ...propertyDoc.data() } as Property;
      }
      return null;
    } catch (error) {
      console.error("Error getting property:", error);
      return mockPropertyService.getPropertyById(propertyId);
    }
  }

  // Get all properties with pagination
  async getProperties(
    pageSize: number = 10,
    lastDoc?: DocumentSnapshot
  ): Promise<{
    properties: Property[];
    hasMore: boolean;
    lastDoc: DocumentSnapshot;
  }> {
    try {
      let q = query(
        this.propertiesCollection,
        where("availability.isActive", "==", true),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const properties = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Property)
      );

      return {
        properties,
        hasMore: querySnapshot.docs.length === pageSize,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      };
    } catch (error) {
      console.error("Error getting properties:", error);
      throw error;
    }
  }

  // Get all properties (admin only)
  async getAllProperties(): Promise<Property[]> {
    // Check environment configuration
    console.log("🔍 Environment check:");
    console.log("  - USE_MOCK_DATA:", USE_MOCK_DATA);
    console.log("  - Firebase DB available:", !!db);
    console.log("  - Firebase project ID:", db?.app?.options?.projectId);

    // Use mock data if Firebase is not configured
    if (USE_MOCK_DATA || !db) {
      console.log(
        "🔧 Using mock property data - Set USE_MOCK_DATA=false in .env to use real database"
      );
      return mockPropertyService.getAllProperties();
    }

    try {
      console.log("🔍 Attempting to fetch real properties from Firebase...");
      const q = query(
        this.propertiesCollection,
        where("availability.isActive", "==", true),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const properties = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Property)
      );

      console.log(
        `📊 SUCCESS: Loaded ${properties.length} active properties from database`
      );
      if (properties.length > 0) {
        console.log("🏠 First property:", properties[0].title);
      }
      return properties;
    } catch (error) {
      console.error("❌ Error getting all properties:", error);
      console.log("🔧 Falling back to mock property data");
      return mockPropertyService.getAllProperties();
    }
  }

  // Get all properties for admin (including inactive ones)
  async getAllPropertiesForAdmin(): Promise<Property[]> {
    // Check environment configuration
    console.log("🔍 Admin environment check:");
    console.log("  - USE_MOCK_DATA:", USE_MOCK_DATA);
    console.log("  - Firebase DB available:", !!db);

    // Use mock data if Firebase is not configured
    if (USE_MOCK_DATA || !db) {
      console.log(
        "🔧 Using mock property data for admin - Set USE_MOCK_DATA=false in .env to use real database"
      );
      return mockPropertyService.getAllProperties();
    }

    try {
      console.log("🔍 Attempting to fetch ALL properties from Firebase...");
      const q = query(this.propertiesCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const properties = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Property)
      );

      console.log(
        `🏠 SUCCESS: Admin loaded ${properties.length} total properties from database`
      );
      if (properties.length > 0) {
        console.log("🏠 Properties found:");
        properties.forEach((prop, index) => {
          console.log(
            `  ${index + 1}. ${prop.title} (${
              prop.availability.isActive ? "Active" : "Inactive"
            })`
          );
        });
      } else {
        console.log(
          "⚠️  No properties found in database. Please add properties through the admin panel."
        );
      }
      return properties;
    } catch (error) {
      console.error("❌ Error getting all properties for admin:", error);
      console.log("🔧 Falling back to mock property data");
      return mockPropertyService.getAllProperties();
    }
  }

  // Search properties by location
  async searchPropertiesByLocation(
    city: string,
    state?: string,
    country?: string
  ): Promise<Property[]> {
    try {
      let q = query(
        this.propertiesCollection,
        where("availability.isActive", "==", true),
        where("location.city", "==", city)
      );

      if (state) {
        q = query(q, where("location.state", "==", state));
      }

      if (country) {
        q = query(q, where("location.country", "==", country));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Property)
      );
    } catch (error) {
      console.error("Error searching properties:", error);
      throw error;
    }
  }

  // Filter properties by criteria
  async filterProperties(filters: {
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    minGuests?: number;
    maxGuests?: number;
    amenities?: string[];
    city?: string;
    state?: string;
    country?: string;
  }): Promise<Property[]> {
    try {
      let q = query(
        this.propertiesCollection,
        where("availability.isActive", "==", true)
      );

      if (filters.propertyType) {
        q = query(q, where("propertyType", "==", filters.propertyType));
      }

      if (filters.minPrice || filters.maxPrice) {
        if (filters.minPrice) {
          q = query(q, where("pricing.basePrice", ">=", filters.minPrice));
        }
        if (filters.maxPrice) {
          q = query(q, where("pricing.basePrice", "<=", filters.maxPrice));
        }
      }

      if (filters.minGuests || filters.maxGuests) {
        if (filters.minGuests) {
          q = query(q, where("capacity.maxGuests", ">=", filters.minGuests));
        }
        if (filters.maxGuests) {
          q = query(q, where("capacity.maxGuests", "<=", filters.maxGuests));
        }
      }

      if (filters.city) {
        q = query(q, where("location.city", "==", filters.city));
      }

      if (filters.state) {
        q = query(q, where("location.state", "==", filters.state));
      }

      if (filters.country) {
        q = query(q, where("location.country", "==", filters.country));
      }

      const querySnapshot = await getDocs(q);
      let properties = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Property)
      );

      // Filter by amenities (client-side filtering as Firestore doesn't support array-contains-any with multiple conditions)
      if (filters.amenities && filters.amenities.length > 0) {
        properties = properties.filter((property) =>
          filters.amenities!.every((amenity) =>
            property.amenities.includes(amenity)
          )
        );
      }

      return properties;
    } catch (error) {
      console.error("Error filtering properties:", error);
      throw error;
    }
  }

  // Get properties by owner
  async getPropertiesByOwner(ownerUid: string): Promise<Property[]> {
    try {
      const q = query(
        this.propertiesCollection,
        where("owner.uid", "==", ownerUid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Property)
      );
    } catch (error) {
      console.error("Error getting properties by owner:", error);
      throw error;
    }
  }

  // Update property
  async updateProperty(
    propertyId: string,
    updates: Partial<Property>
  ): Promise<void> {
    if (USE_MOCK_DATA || !db) {
      console.log("Mock data: Property update simulated");
      return;
    }

    try {
      await updateDoc(doc(this.propertiesCollection, propertyId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  }

  // Delete property
  async deleteProperty(propertyId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.propertiesCollection, propertyId));
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  }

  // Toggle property availability
  async toggleAvailability(
    propertyId: string,
    isActive: boolean
  ): Promise<void> {
    try {
      await this.updateProperty(propertyId, {
        availability: { isActive } as unknown as Property["availability"],
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error toggling property availability:", error);
      throw error;
    }
  }

  // Get featured properties
  async getFeaturedProperties(limitCount: number = 6): Promise<Property[]> {
    try {
      const q = query(
        this.propertiesCollection,
        where("availability.isActive", "==", true),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Property)
      );
    } catch (error) {
      console.error("Error getting featured properties:", error);
      throw error;
    }
  }

  // Real-time subscription for properties
  subscribeToProperties(
    callback: (properties: Property[]) => void
  ): () => void {
    const q = query(
      this.propertiesCollection,
      where("availability.isActive", "==", true),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const properties = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Property)
      );
      callback(properties);
    });
  }

  // Real-time subscription for owner properties
  subscribeToOwnerProperties(
    ownerUid: string,
    callback: (properties: Property[]) => void
  ): () => void {
    const q = query(
      this.propertiesCollection,
      where("owner.uid", "==", ownerUid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const properties = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Property)
      );
      callback(properties);
    });
  }

  // Get property statistics
  async getPropertyStats(propertyId: string): Promise<{
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    occupancyRate: number;
  }> {
    try {
      // This would typically involve aggregating data from bookings and reviews
      // For now, return mock data
      return {
        totalBookings: 0,
        totalRevenue: 0,
        averageRating: 0,
        occupancyRate: 0,
      };
    } catch (error) {
      console.error("Error getting property stats:", error);
      throw error;
    }
  }

  // Get similar properties
  async getSimilarProperties(
    propertyId: string,
    limitCount: number = 3
  ): Promise<Property[]> {
    try {
      const property = await this.getPropertyById(propertyId);
      if (!property) return [];

      const q = query(
        this.propertiesCollection,
        where("availability.isActive", "==", true),
        where("propertyType", "==", property.propertyType),
        where("location.city", "==", property.location.city),
        orderBy("createdAt", "desc"),
        limit(limitCount + 1) // +1 to exclude the current property
      );

      const querySnapshot = await getDocs(q);
      const properties = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Property))
        .filter((p) => p.id !== propertyId) // Exclude current property
        .slice(0, limitCount);

      return properties;
    } catch (error) {
      console.error("Error getting similar properties:", error);
      throw error;
    }
  }
}

export const propertyService = PropertyService.getInstance();

import { propertyService } from "@/lib/services/properties";
import { Property } from "@/lib/types/firebase";

export const demoPropertyData: Omit<
  Property,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    title: "Luxury Ocean Villa - Dubai Marina",
    description:
      "Stunning 4-bedroom villa with panoramic ocean views, private pool, and modern amenities. Located in the heart of Dubai Marina with easy access to beaches, restaurants, and entertainment.",
    propertyType: "villa",
    location: {
      address: "Marina Walk, Dubai Marina",
      city: "Dubai",
      state: "Dubai",
      country: "United Arab Emirates",
      zipCode: "00000",
      latitude: 25.0772,
      longitude: 55.1342,
    },
    capacity: {
      maxGuests: 8,
      bedrooms: 4,
      bathrooms: 3.5,
      beds: 5,
    },
    pricing: {
      basePrice: 750,
      currency: "USD",
      cleaningFee: 100,
      serviceFee: 75,
      weeklyDiscount: 10,
      monthlyDiscount: 20,
    },
    amenities: ["wifi", "pool", "kitchen", "tv", "ac", "parking", "gym"],
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01806-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01812-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01817-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg",
    ],
    availability: {
      isActive: true,
      minStay: 2,
      maxStay: 30,
      instantBook: true,
    },
    rules: {
      checkIn: "15:00",
      checkOut: "11:00",
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: false,
      quietHours: "22:00-08:00",
    },
    owner: {
      uid: "admin",
      name: "LuxeStay Properties",
      email: "properties@luxestay.com",
    },
    rating: {
      average: 4.8,
      count: 127,
      breakdown: {
        cleanliness: 4.9,
        communication: 4.7,
        checkIn: 4.8,
        accuracy: 4.8,
        location: 4.9,
        value: 4.6,
      },
    },
    bookings: {
      total: 127,
      confirmed: 120,
      pending: 2,
      cancelled: 5,
    },
    status: "active",
    featured: true,
    tags: ["luxury", "ocean-view", "pool", "dubai", "marina"],
  },
  {
    title: "Modern Downtown Apartment - Business District",
    description:
      "Sleek 2-bedroom apartment in the heart of downtown with stunning city views. Perfect for business travelers and couples. Walking distance to metro, restaurants, and shopping centers.",
    propertyType: "apartment",
    location: {
      address: "Sheikh Zayed Road, Downtown",
      city: "Dubai",
      state: "Dubai",
      country: "United Arab Emirates",
      zipCode: "00000",
      latitude: 25.1972,
      longitude: 55.2744,
    },
    capacity: {
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 2,
      beds: 2,
    },
    pricing: {
      basePrice: 320,
      currency: "USD",
      cleaningFee: 50,
      serviceFee: 32,
      weeklyDiscount: 8,
      monthlyDiscount: 15,
    },
    amenities: ["wifi", "kitchen", "tv", "ac", "parking"],
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01840-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01846-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01856-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01861-HDR.jpg",
    ],
    availability: {
      isActive: true,
      minStay: 1,
      maxStay: 14,
      instantBook: true,
    },
    rules: {
      checkIn: "14:00",
      checkOut: "12:00",
      smokingAllowed: false,
      petsAllowed: true,
      partiesAllowed: false,
      quietHours: "23:00-07:00",
    },
    owner: {
      uid: "admin",
      name: "Urban Living Co.",
      email: "urban@luxestay.com",
    },
    rating: {
      average: 4.6,
      count: 89,
      breakdown: {
        cleanliness: 4.7,
        communication: 4.5,
        checkIn: 4.6,
        accuracy: 4.6,
        location: 4.8,
        value: 4.5,
      },
    },
    bookings: {
      total: 89,
      confirmed: 85,
      pending: 1,
      cancelled: 3,
    },
    status: "active",
    featured: false,
    tags: ["modern", "downtown", "business", "city-view", "metro"],
  },
  {
    title: "Cozy Studio in Old Town - Historic District",
    description:
      "Charming studio apartment in the historic old town with traditional architecture and modern comforts. Perfect for solo travelers and couples seeking authentic local experience.",
    propertyType: "studio",
    location: {
      address: "Al Fahidi Historical District",
      city: "Dubai",
      state: "Dubai",
      country: "United Arab Emirates",
      zipCode: "00000",
      latitude: 25.2048,
      longitude: 55.2708,
    },
    capacity: {
      maxGuests: 2,
      bedrooms: 0,
      bathrooms: 1,
      beds: 1,
    },
    pricing: {
      basePrice: 180,
      currency: "USD",
      cleaningFee: 30,
      serviceFee: 18,
      weeklyDiscount: 12,
      monthlyDiscount: 25,
    },
    amenities: ["wifi", "kitchen", "tv", "ac"],
    images: [
      "/media/Close Ups June 25 2025/DSC01827.jpg",
      "/media/Close Ups June 25 2025/DSC01831.jpg",
      "/media/Close Ups June 25 2025/DSC01832.jpg",
      "/media/Close Ups June 25 2025/DSC01833.jpg",
    ],
    availability: {
      isActive: true,
      minStay: 1,
      maxStay: 21,
      instantBook: false,
    },
    rules: {
      checkIn: "16:00",
      checkOut: "10:00",
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: false,
      quietHours: "22:00-08:00",
    },
    owner: {
      uid: "admin",
      name: "Heritage Stays",
      email: "heritage@luxestay.com",
    },
    rating: {
      average: 4.4,
      count: 56,
      breakdown: {
        cleanliness: 4.5,
        communication: 4.3,
        checkIn: 4.4,
        accuracy: 4.4,
        location: 4.6,
        value: 4.3,
      },
    },
    bookings: {
      total: 56,
      confirmed: 52,
      pending: 1,
      cancelled: 3,
    },
    status: "active",
    featured: false,
    tags: ["cozy", "historic", "authentic", "old-town", "cultural"],
  },
  {
    title: "Luxury Penthouse - Sky High Views",
    description:
      "Exclusive 3-bedroom penthouse with 360-degree city views, private terrace, and premium amenities. The ultimate luxury experience for discerning guests.",
    propertyType: "penthouse",
    location: {
      address: "Burj Khalifa Boulevard, Downtown",
      city: "Dubai",
      state: "Dubai",
      country: "United Arab Emirates",
      zipCode: "00000",
      latitude: 25.1968,
      longitude: 55.2744,
    },
    capacity: {
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 3,
      beds: 4,
    },
    pricing: {
      basePrice: 950,
      currency: "USD",
      cleaningFee: 150,
      serviceFee: 95,
      weeklyDiscount: 15,
      monthlyDiscount: 25,
    },
    amenities: [
      "wifi",
      "pool",
      "kitchen",
      "tv",
      "ac",
      "parking",
      "gym",
      "breakfast",
    ],
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01866-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01871-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01884-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01889-HDR.jpg",
    ],
    availability: {
      isActive: true,
      minStay: 3,
      maxStay: 45,
      instantBook: false,
    },
    rules: {
      checkIn: "15:00",
      checkOut: "12:00",
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: true,
      quietHours: "23:00-07:00",
    },
    owner: {
      uid: "admin",
      name: "Elite Properties",
      email: "elite@luxestay.com",
    },
    rating: {
      average: 4.9,
      count: 78,
      breakdown: {
        cleanliness: 5.0,
        communication: 4.8,
        checkIn: 4.9,
        accuracy: 4.9,
        location: 5.0,
        value: 4.7,
      },
    },
    bookings: {
      total: 78,
      confirmed: 76,
      pending: 1,
      cancelled: 1,
    },
    status: "active",
    featured: true,
    tags: ["luxury", "penthouse", "views", "exclusive", "premium"],
  },
  {
    title: "Beach House - Seaside Retreat",
    description:
      "Beautiful 3-bedroom beach house with direct beach access, stunning sunset views, and tropical garden. Perfect for families and groups seeking a peaceful escape.",
    propertyType: "house",
    location: {
      address: "Jumeirah Beach Road, Jumeirah",
      city: "Dubai",
      state: "Dubai",
      country: "United Arab Emirates",
      zipCode: "00000",
      latitude: 25.2084,
      longitude: 55.2719,
    },
    capacity: {
      maxGuests: 8,
      bedrooms: 3,
      bathrooms: 2,
      beds: 4,
    },
    pricing: {
      basePrice: 650,
      currency: "USD",
      cleaningFee: 80,
      serviceFee: 65,
      weeklyDiscount: 12,
      monthlyDiscount: 20,
    },
    amenities: ["wifi", "pool", "kitchen", "tv", "ac", "parking"],
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01897-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01902-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01904-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01909-HDR.jpg",
    ],
    availability: {
      isActive: true,
      minStay: 2,
      maxStay: 21,
      instantBook: true,
    },
    rules: {
      checkIn: "15:00",
      checkOut: "11:00",
      smokingAllowed: false,
      petsAllowed: true,
      partiesAllowed: false,
      quietHours: "22:00-08:00",
    },
    owner: {
      uid: "admin",
      name: "Coastal Properties",
      email: "coastal@luxestay.com",
    },
    rating: {
      average: 4.7,
      count: 94,
      breakdown: {
        cleanliness: 4.8,
        communication: 4.6,
        checkIn: 4.7,
        accuracy: 4.7,
        location: 4.9,
        value: 4.6,
      },
    },
    bookings: {
      total: 94,
      confirmed: 89,
      pending: 2,
      cancelled: 3,
    },
    status: "active",
    featured: true,
    tags: ["beach", "family", "garden", "sunset", "peaceful"],
  },
  {
    title: "Chic Loft - Arts District",
    description:
      "Trendy industrial loft in the vibrant arts district with exposed brick walls, high ceilings, and artistic flair. Ideal for creative professionals and art enthusiasts.",
    propertyType: "loft",
    location: {
      address: "Alserkal Avenue, Al Quoz",
      city: "Dubai",
      state: "Dubai",
      country: "United Arab Emirates",
      zipCode: "00000",
      latitude: 25.1376,
      longitude: 55.2323,
    },
    capacity: {
      maxGuests: 4,
      bedrooms: 1,
      bathrooms: 1,
      beds: 2,
    },
    pricing: {
      basePrice: 280,
      currency: "USD",
      cleaningFee: 45,
      serviceFee: 28,
      weeklyDiscount: 10,
      monthlyDiscount: 18,
    },
    amenities: ["wifi", "kitchen", "tv", "ac"],
    images: [
      "/media/Close Ups June 25 2025/DSC01835.jpg",
      "/media/Close Ups June 25 2025/DSC01964.jpg",
      "/media/Close Ups June 25 2025/DSC01965.jpg",
      "/media/Close Ups June 25 2025/DSC01969.jpg",
    ],
    availability: {
      isActive: true,
      minStay: 2,
      maxStay: 28,
      instantBook: false,
    },
    rules: {
      checkIn: "16:00",
      checkOut: "11:00",
      smokingAllowed: false,
      petsAllowed: true,
      partiesAllowed: true,
      quietHours: "00:00-08:00",
    },
    owner: {
      uid: "admin",
      name: "Art Living Spaces",
      email: "artliving@luxestay.com",
    },
    rating: {
      average: 4.5,
      count: 67,
      breakdown: {
        cleanliness: 4.6,
        communication: 4.4,
        checkIn: 4.5,
        accuracy: 4.5,
        location: 4.6,
        value: 4.4,
      },
    },
    bookings: {
      total: 67,
      confirmed: 62,
      pending: 3,
      cancelled: 2,
    },
    status: "active",
    featured: false,
    tags: ["artistic", "loft", "creative", "trendy", "unique"],
  },
];

// Helper function to populate property demo data
export async function populatePropertyDemoData(): Promise<void> {
  try {
    console.log("🏠 Starting property demo data population...");

    const createdIds: string[] = [];

    for (const propertyData of demoPropertyData) {
      try {
        const propertyId = await propertyService.createProperty(propertyData);
        createdIds.push(propertyId);
        console.log(`✅ Created property: ${propertyData.title}`);
      } catch (error) {
        console.error(
          `❌ Failed to create property: ${propertyData.title}`,
          error
        );
      }
    }

    console.log(`✅ Successfully created ${createdIds.length} demo properties`);
    console.log("📊 Property demo data populated in database");

    return Promise.resolve();
  } catch (error) {
    console.error("❌ Error populating property demo data:", error);
    throw error;
  }
}

// Helper function to get property demo data statistics
export function getPropertyDemoDataStats() {
  const stats = {
    totalProperties: demoPropertyData.length,
    propertyTypes: [...new Set(demoPropertyData.map((p) => p.propertyType))],
    locations: [...new Set(demoPropertyData.map((p) => p.location.city))],
    priceRange: {
      min: Math.min(...demoPropertyData.map((p) => p.pricing.basePrice)),
      max: Math.max(...demoPropertyData.map((p) => p.pricing.basePrice)),
      average:
        demoPropertyData.reduce((sum, p) => sum + p.pricing.basePrice, 0) /
        demoPropertyData.length,
    },
    capacity: {
      totalGuests: demoPropertyData.reduce(
        (sum, p) => sum + p.capacity.maxGuests,
        0
      ),
      totalBedrooms: demoPropertyData.reduce(
        (sum, p) => sum + p.capacity.bedrooms,
        0
      ),
    },
    featured: demoPropertyData.filter((p) => p.featured).length,
    amenityCoverage: demoPropertyData.reduce((acc, p) => {
      p.amenities.forEach((amenity) => {
        acc[amenity] = (acc[amenity] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>),
  };

  return stats;
}

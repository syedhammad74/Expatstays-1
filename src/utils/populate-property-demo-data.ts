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
      coordinates: { lat: 25.0772, lng: 55.1342 },
    },
    capacity: {
      maxGuests: 8,
      bedrooms: 4,
      bathrooms: 3.5,
    },
    pricing: {
      basePrice: 750,
      currency: "USD",
      cleaningFee: 100,
      serviceFee: 75,
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
      minimumStay: 2,
      maximumStay: 30,
    },
    owner: {
      uid: "admin",
      name: "LuxeStay Properties",
      email: "properties@luxestay.com",
    },
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
      coordinates: { lat: 25.2744, lng: 55.2744 },
    },
    capacity: {
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 2,
    },
    pricing: {
      basePrice: 320,
      currency: "USD",
      cleaningFee: 50,
      serviceFee: 32,
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
      minimumStay: 1,
      maximumStay: 14,
    },
    owner: {
      uid: "admin",
      name: "Urban Living Co.",
      email: "urban@luxestay.com",
    },
  },
  {
    title: "Cozy Studio in Old Town - Historic District",
    description:
      "Charming studio apartment in the historic old town with traditional architecture and modern comforts. Perfect for solo travelers and couples seeking authentic local experience.",
    propertyType: "apartment",
    location: {
      address: "Al Fahidi Historical District",
      city: "Dubai",
      state: "Dubai",
      country: "United Arab Emirates",
      coordinates: { lat: 25.2708, lng: 55.2708 },
    },
    capacity: {
      maxGuests: 2,
      bedrooms: 0,
      bathrooms: 1,
    },
    pricing: {
      basePrice: 180,
      currency: "USD",
      cleaningFee: 30,
      serviceFee: 18,
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
      minimumStay: 1,
      maximumStay: 21,
    },
    owner: {
      uid: "admin",
      name: "Heritage Stays",
      email: "heritage@luxestay.com",
    },
  },
  {
    title: "Luxury Penthouse - Sky High Views",
    description:
      "Exclusive 3-bedroom penthouse with 360-degree city views, private terrace, and premium amenities. The ultimate luxury experience for discerning guests.",
    propertyType: "apartment",
    location: {
      address: "Burj Khalifa Boulevard, Downtown",
      city: "Dubai",
      state: "Dubai",
      country: "United Arab Emirates",
      coordinates: { lat: 25.2744, lng: 55.2744 },
    },
    capacity: {
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 3,
    },
    pricing: {
      basePrice: 950,
      currency: "USD",
      cleaningFee: 150,
      serviceFee: 95,
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
      minimumStay: 3,
      maximumStay: 45,
    },
    owner: {
      uid: "admin",
      name: "Elite Properties",
      email: "elite@luxestay.com",
    },
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
      coordinates: { lat: 25.2719, lng: 55.2719 },
    },
    capacity: {
      maxGuests: 8,
      bedrooms: 3,
      bathrooms: 2,
    },
    pricing: {
      basePrice: 650,
      currency: "USD",
      cleaningFee: 80,
      serviceFee: 65,
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
      minimumStay: 2,
      maximumStay: 21,
    },
    owner: {
      uid: "admin",
      name: "Coastal Properties",
      email: "coastal@luxestay.com",
    },
  },
  {
    title: "Chic Loft - Arts District",
    description:
      "Trendy industrial loft in the vibrant arts district with exposed brick walls, high ceilings, and artistic flair. Ideal for creative professionals and art enthusiasts.",
    propertyType: "apartment",
    location: {
      address: "Alserkal Avenue, Al Quoz",
      city: "Dubai",
      state: "Dubai",
      country: "United Arab Emirates",
      coordinates: { lat: 25.2323, lng: 55.2323 },
    },
    capacity: {
      maxGuests: 4,
      bedrooms: 1,
      bathrooms: 1,
    },
    pricing: {
      basePrice: 280,
      currency: "USD",
      cleaningFee: 45,
      serviceFee: 28,
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
      minimumStay: 2,
      maximumStay: 28,
    },
    owner: {
      uid: "admin",
      name: "Art Living Spaces",
      email: "artliving@luxestay.com",
    },
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

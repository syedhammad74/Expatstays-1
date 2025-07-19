import { adminDataService, AdminDataItem } from "@/lib/services/admin-data";

export const demoAdminData: Omit<
  AdminDataItem,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    title: "Property Pricing Update",
    description: "Updated pricing rules for luxury villas in Miami Beach",
    category: "pricing",
    data: {
      propertyType: "villa",
      location: "Miami Beach",
      basePrice: 500,
      seasonalMultiplier: 1.2,
      minStay: 3,
    },
    createdBy: "admin",
    priority: "high",
    status: "active",
    tags: ["pricing", "villa", "miami", "luxury"],
  },
  {
    title: "New Amenity Guidelines",
    description: "Updated guidelines for listing property amenities",
    category: "guidelines",
    data: {
      mandatoryAmenities: ["WiFi", "Kitchen", "Bathroom"],
      premiumAmenities: ["Pool", "Ocean View", "Gym", "Spa"],
      verification: "required",
    },
    createdBy: "admin",
    priority: "medium",
    status: "active",
    tags: ["amenities", "guidelines", "property", "verification"],
  },
  {
    title: "Booking Policy Changes",
    description: "Updated cancellation and refund policies",
    category: "policies",
    data: {
      cancellationDeadline: 48,
      refundPercentage: 80,
      nonRefundableFee: 50,
      specialEventPolicy: "no-cancellation",
    },
    createdBy: "admin",
    priority: "high",
    status: "active",
    tags: ["booking", "cancellation", "refund", "policy"],
  },
  {
    title: "SEO Keywords Research",
    description: "Research data for improving property listing visibility",
    category: "marketing",
    data: {
      topKeywords: ["luxury rental", "vacation home", "beachfront", "villa"],
      searchVolume: 15000,
      competition: "medium",
      recommendedBid: 2.5,
    },
    createdBy: "admin",
    priority: "low",
    status: "active",
    tags: ["seo", "marketing", "keywords", "visibility"],
  },
  {
    title: "Customer Feedback Analysis",
    description: "Analysis of customer reviews and feedback patterns",
    category: "analytics",
    data: {
      averageRating: 4.6,
      totalReviews: 1250,
      commonComplaints: ["wifi speed", "check-in process"],
      commonPraises: ["cleanliness", "location", "amenities"],
      improvementAreas: ["communication", "wifi infrastructure"],
    },
    createdBy: "admin",
    priority: "medium",
    status: "active",
    tags: ["feedback", "reviews", "analytics", "improvement"],
  },
  {
    title: "Integration Test Data",
    description: "Test data for API integrations and third-party services",
    category: "testing",
    data: {
      testEndpoints: ["/api/properties", "/api/bookings", "/api/users"],
      mockResponses: true,
      testCases: 25,
      lastRun: "2024-01-15T10:30:00Z",
    },
    createdBy: "admin",
    priority: "low",
    status: "inactive",
    tags: ["testing", "api", "integration", "development"],
  },
  {
    title: "Holiday Season Promotions",
    description: "Special promotion codes and discounts for holiday season",
    category: "promotions",
    data: {
      promotionCodes: ["HOLIDAY2024", "WINTER25", "NEWYEAR30"],
      discountPercentages: [15, 25, 30],
      validUntil: "2024-12-31",
      applicableProperties: "all",
    },
    createdBy: "admin",
    priority: "high",
    status: "archived",
    tags: ["promotions", "holiday", "discount", "seasonal"],
  },
  {
    title: "Security Audit Results",
    description: "Results from latest security audit and recommended actions",
    category: "security",
    data: {
      vulnerabilities: 3,
      severity: "medium",
      patchesRequired: ["auth-update", "validation-fix", "rate-limiting"],
      completionDeadline: "2024-02-01",
    },
    createdBy: "admin",
    priority: "high",
    status: "active",
    tags: ["security", "audit", "vulnerabilities", "patches"],
  },
];

// Helper function to populate demo data
export async function populateDemoData(): Promise<void> {
  try {
    console.log("🚀 Starting demo data population...");

    const createdIds = await adminDataService.bulkCreateAdminData(
      demoAdminData
    );

    console.log(`✅ Successfully created ${createdIds.length} demo data items`);
    console.log(
      "📊 Demo data populated in both Firestore and Realtime Database"
    );

    return Promise.resolve();
  } catch (error) {
    console.error("❌ Error populating demo data:", error);
    throw error;
  }
}

// Helper function to clear demo data
export async function clearDemoData(): Promise<void> {
  try {
    console.log("🧹 Clearing demo data...");

    // Get all admin data
    const allData = await adminDataService.getAllAdminData();

    // Filter demo data (by checking if title matches our demo titles)
    const demoTitles = demoAdminData.map((item) => item.title);
    const demoDataIds = allData
      .filter((item) => demoTitles.includes(item.title))
      .map((item) => item.id!)
      .filter(Boolean);

    if (demoDataIds.length > 0) {
      await adminDataService.bulkDeleteAdminData(demoDataIds);
      console.log(
        `✅ Successfully cleared ${demoDataIds.length} demo data items`
      );
    } else {
      console.log("ℹ️ No demo data found to clear");
    }

    return Promise.resolve();
  } catch (error) {
    console.error("❌ Error clearing demo data:", error);
    throw error;
  }
}

// Helper function to get demo data statistics
export function getDemoDataStats() {
  const stats = {
    totalItems: demoAdminData.length,
    categories: [...new Set(demoAdminData.map((item) => item.category))],
    priorities: demoAdminData.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    statuses: demoAdminData.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    tags: demoAdminData
      .flatMap((item) => item.tags)
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
  };

  return stats;
}

export default {
  demoAdminData,
  populateDemoData,
  clearDemoData,
  getDemoDataStats,
};

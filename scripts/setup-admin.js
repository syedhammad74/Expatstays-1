const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin SDK
const serviceAccount = require("../firebaseConfig.js");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "expat-stays",
  });
}

const db = getFirestore();

async function setupAdmin() {
  try {
    console.log("🔧 Setting up admin access...");

    // Get current user or create admin user
    const adminEmail = "admin@expat-stays.com"; // Change this to your email
    const adminUser = {
      id: "admin-user-1", // You can use your actual Firebase Auth UID
      email: adminEmail,
      role: "SUPER_ADMIN",
      firstName: "Admin",
      lastName: "User",
      phone: "+1234567890",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      permissions: [
        "read:all",
        "write:all",
        "delete:all",
        "admin:dashboard",
        "admin:users",
        "admin:properties",
        "admin:bookings",
        "admin:analytics",
      ],
    };

    // Create admin user document
    await db
      .collection("users")
      .doc("admin-user-1")
      .set(adminUser, { merge: true });
    console.log("✅ Admin user created/updated");

    // Create some sample dashboard stats
    const dashboardStats = {
      totalBookings: 0,
      totalRevenue: 0,
      occupancyRate: 0,
      activeProperties: 12,
      lastUpdated: new Date().toISOString(),
    };

    await db
      .collection("dashboard_stats")
      .doc("overview")
      .set(dashboardStats, { merge: true });
    console.log("✅ Dashboard stats initialized");

    // Create admin notification settings
    const notificationSettings = {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReports: true,
      bookingAlerts: true,
      lastModified: new Date().toISOString(),
    };

    await db
      .collection("admin_notifications")
      .doc("settings")
      .set(notificationSettings, { merge: true });
    console.log("✅ Admin notifications configured");

    console.log("\n🎉 Admin setup completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Make sure you're signed in with the admin email");
    console.log("2. Deploy the updated Firestore rules");
    console.log("3. Refresh the admin dashboard");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up admin:", error);
    process.exit(1);
  }
}

setupAdmin();

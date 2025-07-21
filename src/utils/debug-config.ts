import { db } from "@/lib/firebase";

export const debugConfiguration = () => {
  console.log("🔍 === CONFIGURATION DEBUG ===");
  console.log("Environment Variables:");
  console.log("  - NODE_ENV:", process.env.NODE_ENV);
  console.log("  - USE_MOCK_DATA:", process.env.USE_MOCK_DATA);

  console.log("\nFirebase Configuration:");
  console.log("  - Database available:", !!db);
  console.log("  - Project ID:", db?.app?.options?.projectId);
  console.log(
    "  - API Key available:",
    !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  );
  console.log("  - Auth Domain:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);

  console.log("\nData Source Decision:");
  if (process.env.USE_MOCK_DATA) {
    console.log("  ❌ USING MOCK DATA - Properties will be fake");
    console.log("  🔧 Solution: Set USE_MOCK_DATA=false in .env.local");
  } else if (!db) {
    console.log("  ❌ FIREBASE NOT CONFIGURED - Falling back to mock data");
    console.log("  🔧 Solution: Add Firebase config to .env.local");
  } else {
    console.log("  ✅ USING REAL FIREBASE DATA");
  }
  console.log("=================================");
};

export const createEnvironmentInstructions = () => {
  return `
# Create .env.local in your project root with these settings:

# CRITICAL: Set this to false to use real data
USE_MOCK_DATA=false

# Your Firebase Configuration (replace with actual values)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Optional: Development Settings
NEXT_PUBLIC_USE_EMULATORS=false
NEXT_PUBLIC_USE_DATA_CONNECT=true

# Optional: Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
SKIP_STRIPE_PAYMENT=true
`;
};

export default debugConfiguration;

const fs = require("fs");
const path = require("path");

console.log("🔍 === Configuration Verification ===\n");

// Check .env.local file
const envLocalPath = path.join(process.cwd(), ".env.local");
const envExists = fs.existsSync(envLocalPath);

console.log("📁 Environment File Check:");
console.log(`  - .env.local exists: ${envExists ? "✅" : "❌"}`);

if (envExists) {
  const envContent = fs.readFileSync(envLocalPath, "utf8");
  const lines = envContent
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"));

  console.log(`  - .env.local lines: ${lines.length}`);

  // Check critical variables
  const hasMockData = envContent.includes("USE_MOCK_DATA=false");
  const hasFirebaseConfig = envContent.includes(
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  );

  console.log(`  - USE_MOCK_DATA=false set: ${hasMockData ? "✅" : "❌"}`);
  console.log(
    `  - Firebase config present: ${hasFirebaseConfig ? "✅" : "❌"}`
  );

  if (!hasMockData) {
    console.log("  ⚠️  Add: USE_MOCK_DATA=false");
  }

  if (!hasFirebaseConfig) {
    console.log("  ⚠️  Add Firebase configuration variables");
  }
} else {
  console.log("  ⚠️  Create .env.local file from env.template");
}

// Check package.json scripts
const packagePath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  console.log("\n📦 Project Check:");
  console.log(`  - Project name: ${packageJson.name || "Unknown"}`);
  console.log(`  - Has dev script: ${packageJson.scripts?.dev ? "✅" : "❌"}`);
}

// Check if Firebase files exist
const firebaseFiles = [
  "firebase.json",
  "firestore.rules",
  "firestore.indexes.json",
];

console.log("\n🔥 Firebase Files:");
firebaseFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  - ${file}: ${exists ? "✅" : "❌"}`);
});

console.log("\n🚀 Next Steps:");
if (!envExists) {
  console.log("1. Copy env.template to .env.local");
  console.log("2. Set USE_MOCK_DATA=false in .env.local");
  console.log("3. Add your Firebase configuration");
  console.log("4. Restart development server: npm run dev");
} else {
  console.log("1. Restart development server: npm run dev");
  console.log("2. Check browser console for detailed logging");
  console.log("3. Visit http://localhost:3000/properties to test");
}

console.log("\n=================================");

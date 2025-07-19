#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔍 Validating Firebase Configuration...\n");

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local");
const envExists = fs.existsSync(envPath);

console.log(
  `📁 Environment file (.env.local): ${envExists ? "✅ Found" : "❌ Missing"}`
);

if (!envExists) {
  console.log("❗ Please create .env.local file using the env.template");
  console.log("💡 Run: cp env.template .env.local\n");
}

// Check required environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
];

const optionalEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
];

console.log("🔧 Environment Variables Status:");

let missingRequired = [];
let missingOptional = [];

// Load environment variables if .env.local exists
if (envExists) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const envLines = envContent.split("\n");
  const envVars = {};

  envLines.forEach((line) => {
    if (line.includes("=") && !line.startsWith("#")) {
      const [key, value] = line.split("=");
      envVars[key.trim()] = value ? value.trim() : "";
    }
  });

  // Check required variables
  requiredEnvVars.forEach((varName) => {
    const value = envVars[varName] || process.env[varName];
    if (!value || value === "") {
      missingRequired.push(varName);
      console.log(`   ❌ ${varName}: Missing`);
    } else {
      console.log(`   ✅ ${varName}: Set`);
    }
  });

  // Check optional variables
  console.log("\n🔧 Optional Environment Variables:");
  optionalEnvVars.forEach((varName) => {
    const value = envVars[varName] || process.env[varName];
    if (!value || value === "") {
      missingOptional.push(varName);
      console.log(`   ⚠️  ${varName}: Not set (optional)`);
    } else {
      console.log(`   ✅ ${varName}: Set`);
    }
  });
} else {
  missingRequired = requiredEnvVars;
}

// Check Firebase project files
console.log("\n📂 Firebase Configuration Files:");

const firebaseFiles = [
  "firebase.json",
  "firestore.rules",
  "firestore.indexes.json",
  "dataconnect/dataconnect.yaml",
  "functions/package.json",
];

firebaseFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(
    `   ${exists ? "✅" : "❌"} ${file}: ${exists ? "Found" : "Missing"}`
  );
});

// Check dependencies
console.log("\n📦 Key Dependencies:");

const packageJsonPath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const keyDeps = [
    "firebase",
    "next",
    "react",
    "@stripe/stripe-js",
    "tailwindcss",
  ];

  keyDeps.forEach((dep) => {
    if (deps[dep]) {
      console.log(`   ✅ ${dep}: ${deps[dep]}`);
    } else {
      console.log(`   ❌ ${dep}: Missing`);
    }
  });
} else {
  console.log("   ❌ package.json: Missing");
}

// Summary
console.log("\n📋 Configuration Summary:");

if (missingRequired.length === 0) {
  console.log("✅ All required Firebase configuration is present");
} else {
  console.log(
    `❌ Missing ${missingRequired.length} required environment variables:`
  );
  missingRequired.forEach((variable) => {
    console.log(`   - ${variable}`);
  });
}

if (missingOptional.length > 0) {
  console.log(
    `⚠️  ${missingOptional.length} optional environment variables not set:`
  );
  missingOptional.forEach((variable) => {
    console.log(`   - ${variable}`);
  });
}

// Recommendations
console.log("\n💡 Next Steps:");

if (!envExists) {
  console.log("1. Create .env.local file: cp env.template .env.local");
}

if (missingRequired.length > 0) {
  console.log("2. Add missing environment variables to .env.local");
  console.log(
    "3. Get Firebase config from: https://console.firebase.google.com/"
  );
}

if (missingOptional.includes("FIREBASE_PRIVATE_KEY")) {
  console.log(
    "4. Add Firebase Admin SDK credentials for server-side operations"
  );
}

if (missingOptional.includes("STRIPE_SECRET_KEY")) {
  console.log("5. Add Stripe credentials for payment processing");
}

console.log("6. Run: npm run dev to start development server");
console.log("7. Check Firebase Console for any additional setup needed");

// Exit with error code if required config is missing
if (missingRequired.length > 0 || !envExists) {
  console.log("\n❌ Configuration validation failed");
  process.exit(1);
} else {
  console.log("\n✅ Configuration validation passed");
  process.exit(0);
}

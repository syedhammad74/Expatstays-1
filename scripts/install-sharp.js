const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔧 Installing Sharp for image compression...\n");

try {
  // Check if Sharp is already installed
  try {
    require("sharp");
    console.log("✅ Sharp is already installed");
  } catch (error) {
    console.log("📦 Installing Sharp...");
    execSync("npm install sharp", { stdio: "inherit" });
    console.log("✅ Sharp installed successfully");
  }

  // Check if package.json exists
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Add compression script to package.json
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    packageJson.scripts["compress-images"] = "node scripts/compress-images.js";
    packageJson.scripts["install-sharp"] = "node scripts/install-sharp.js";

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log("✅ Added compression scripts to package.json");
  }

  console.log("\n🎉 Setup complete! You can now run:");
  console.log("   npm run compress-images");
} catch (error) {
  console.error("❌ Error installing Sharp:", error.message);
  process.exit(1);
}

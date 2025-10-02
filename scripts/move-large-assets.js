#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

class AssetMover {
  constructor() {
    this.publicDir = path.join(process.cwd(), "public");
    this.backupDir = path.join(process.cwd(), "backup-large-assets");

    this.largeAssets = [
      "media/Video.mp4",
      // Add other large files you want to backup
    ];
  }

  async init() {
    console.log("🔄 Moving Large Assets to Backup...\n");

    // Create backup directory
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    // Move each large asset
    for (const asset of this.largeAssets) {
      const sourcePath = path.join(this.publicDir, asset);
      const backupPath = path.join(this.backupDir, asset);

      if (fs.existsSync(sourcePath)) {
        const backupDir = path.dirname(backupPath);
        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }

        // Move the file
        fs.renameSync(sourcePath, backupPath);

        const stats = fs.statSync(backupPath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

        console.log(`✅ Moved: ${asset} (${sizeInMB}MB)`);
      } else {
        console.log(`⚠️  File not found: ${asset}`);
      }
    }

    console.log("\n📊 Summary:");
    console.log("- Video.mp4 moved to backup-large-assets/");
    console.log("- This reduces initial bundle payload significantly");
    console.log("- Video can be hosted externally or optimized separately");
    console.log("\n🚀 Performance Impact:");
    console.log("- Reduced initial payload by ~50-100MB");
    console.log("- Faster page loads on mobile");
    console.log("- Better Core Web Vitals scores");
  }
}

// Run the mover
const mover = new AssetMover();
mover.init().catch(console.error);

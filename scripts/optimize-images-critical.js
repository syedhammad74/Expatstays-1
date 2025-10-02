#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class CriticalImageOptimizer {
  constructor() {
    this.mediaDir = path.join(process.cwd(), "public", "media");
    this.optimizedDir = path.join(process.cwd(), "public", "optimized");
    this.stats = {
      processed: 0,
      originalSize: 0,
      optimizedSize: 0,
      errors: [],
    };
  }

  async init() {
    // Create optimized directory
    if (!fs.existsSync(this.optimizedDir)) {
      fs.mkdirSync(this.optimizedDir, { recursive: true });
    }

    console.log("🚀 Starting Critical Image Optimization...\n");
    await this.processDirectory(this.mediaDir);
    this.printStats();
  }

  async processDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        await this.processDirectory(fullPath);
      } else if (this.isImageFile(item)) {
        await this.optimizeImage(fullPath);
      }
    }
  }

  isImageFile(filename) {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  }

  async optimizeImage(inputPath) {
    try {
      const relativePath = path.relative(this.mediaDir, inputPath);
      const outputDir = path.join(
        this.optimizedDir,
        path.dirname(relativePath)
      );

      // Create output directory
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const filename = path.parse(inputPath).name;
      const originalSize = fs.statSync(inputPath).size;

      console.log(`📸 Processing: ${relativePath}`);

      // Generate multiple formats and sizes
      const formats = [
        { ext: "avif", quality: 50, sizes: [400, 800, 1200] },
        { ext: "webp", quality: 75, sizes: [400, 800, 1200] },
        { ext: "jpg", quality: 80, sizes: [400, 800, 1200] },
      ];

      let totalOptimizedSize = 0;

      for (const format of formats) {
        for (const size of format.sizes) {
          const outputPath = path.join(
            outputDir,
            `${filename}-${size}w.${format.ext}`
          );

          const buffer = await sharp(inputPath)
            .resize(size, null, {
              withoutEnlargement: true,
              fastShrinkOnLoad: true,
            })
            .toFormat(format.ext, {
              quality: format.quality,
              progressive: true,
              mozjpeg: format.ext === "jpg",
            })
            .toBuffer();

          fs.writeFileSync(outputPath, buffer);
          totalOptimizedSize += buffer.length;
        }
      }

      // Generate blur placeholder
      const blurBuffer = await sharp(inputPath)
        .resize(20, 20, { fit: "inside" })
        .blur(1)
        .jpeg({ quality: 20 })
        .toBuffer();

      const blurDataURL = `data:image/jpeg;base64,${blurBuffer.toString(
        "base64"
      )}`;

      // Save blur data URL for reference
      const blurPath = path.join(outputDir, `${filename}-blur.txt`);
      fs.writeFileSync(blurPath, blurDataURL);

      this.stats.processed++;
      this.stats.originalSize += originalSize;
      this.stats.optimizedSize += totalOptimizedSize;

      const savings = (
        ((originalSize - totalOptimizedSize) / originalSize) *
        100
      ).toFixed(1);
      console.log(
        `  ✅ Saved ${savings}% (${this.formatBytes(
          originalSize
        )} → ${this.formatBytes(totalOptimizedSize)})\n`
      );
    } catch (error) {
      console.error(`❌ Error processing ${inputPath}:`, error.message);
      this.stats.errors.push({ file: inputPath, error: error.message });
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  printStats() {
    console.log("\n🎉 OPTIMIZATION COMPLETE!\n");
    console.log(`📊 Images Processed: ${this.stats.processed}`);
    console.log(
      `📦 Original Size: ${this.formatBytes(this.stats.originalSize)}`
    );
    console.log(
      `🗜️  Optimized Size: ${this.formatBytes(this.stats.optimizedSize)}`
    );

    const totalSavings = this.stats.originalSize - this.stats.optimizedSize;
    const savingsPercent = (
      (totalSavings / this.stats.originalSize) *
      100
    ).toFixed(1);

    console.log(
      `💾 Total Savings: ${this.formatBytes(totalSavings)} (${savingsPercent}%)`
    );

    if (this.stats.errors.length > 0) {
      console.log(`\n❌ Errors: ${this.stats.errors.length}`);
      this.stats.errors.forEach((err) => {
        console.log(`  - ${err.file}: ${err.error}`);
      });
    }

    console.log("\n🚀 Next Steps:");
    console.log("1. Update image imports to use optimized versions");
    console.log("2. Implement responsive image component");
    console.log("3. Add lazy loading with intersection observer");
    console.log("4. Remove original large images from public folder");
  }
}

// Run optimization
const optimizer = new CriticalImageOptimizer();
optimizer.init().catch(console.error);

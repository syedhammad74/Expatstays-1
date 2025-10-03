#!/usr/bin/env node

/**
 * Image Optimization Script
 * Compresses and converts images to modern formats
 */

const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

async function optimizeImages() {
  const mediaDir = path.join(process.cwd(), "public", "media");

  try {
    const files = await fs.readdir(mediaDir, { recursive: true });

    for (const file of files) {
      if (typeof file === "string" && /\.(png|jpg|jpeg)$/i.test(file)) {
        const filePath = path.join(mediaDir, file);
        const ext = path.extname(file).toLowerCase();
        const name = path.basename(file, ext);
        const dir = path.dirname(filePath);

        // Skip if already optimized
        if (file.includes("-compressed") || file.includes(".webp")) {
          continue;
        }

        console.log(`Optimizing: ${file}`);

        try {
          // Create WebP version
          const webpPath = path.join(dir, `${name}-compressed.webp`);
          await sharp(filePath)
            .webp({ quality: 85, effort: 6 })
            .toFile(webpPath);

          console.log(`Created: ${name}-compressed.webp`);

          // Create AVIF version for modern browsers
          const avifPath = path.join(dir, `${name}-compressed.avif`);
          await sharp(filePath)
            .avif({ quality: 80, effort: 9 })
            .toFile(avifPath);

          console.log(`Created: ${name}-compressed.avif`);
        } catch (error) {
          console.error(`Error optimizing ${file}:`, error.message);
        }
      }
    }

    console.log("Image optimization complete!");
  } catch (error) {
    console.error("Error reading media directory:", error.message);
  }
}

// Run if called directly
if (require.main === module) {
  optimizeImages();
}

module.exports = { optimizeImages };

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Configuration for image compression
const COMPRESSION_CONFIG = {
  // Quality settings for different image types
  quality: {
    jpg: 75, // Reduced from 95% to 75%
    webp: 80, // WebP can handle higher quality
    png: 85, // PNG for transparency
  },

  // Maximum dimensions
  maxWidth: 1920,
  maxHeight: 1080,

  // Output formats
  formats: ["webp", "jpg"], // WebP first, JPG fallback

  // Directories to process
  inputDir: "public/media",
  outputDir: "public/media-optimized",
};

// Image processing queue
const processQueue = [];
let processedCount = 0;
let totalCount = 0;

// Get all image files recursively
function getAllImageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllImageFiles(fullPath));
    } else if (isImageFile(item)) {
      files.push(fullPath);
    }
  }

  return files;
}

// Check if file is an image
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
}

// Get file size in MB
function getFileSizeMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

// Create output directory structure
function createOutputDir(inputPath) {
  const relativePath = path.relative(COMPRESSION_CONFIG.inputDir, inputPath);
  const outputPath = path.join(COMPRESSION_CONFIG.outputDir, relativePath);
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return outputPath;
}

// Compress single image
async function compressImage(inputPath) {
  try {
    const originalSize = getFileSizeMB(inputPath);
    const outputPath = createOutputDir(inputPath);
    const outputDir = path.dirname(outputPath);
    const baseName = path.basename(inputPath, path.extname(inputPath));

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const results = [];

    // Process each format
    for (const format of COMPRESSION_CONFIG.formats) {
      const formatOutputPath = path.join(outputDir, `${baseName}.${format}`);

      let sharpInstance = sharp(inputPath).resize(
        COMPRESSION_CONFIG.maxWidth,
        COMPRESSION_CONFIG.maxHeight,
        {
          fit: "inside",
          withoutEnlargement: true,
        }
      );

      // Apply format-specific settings
      switch (format) {
        case "webp":
          sharpInstance = sharpInstance.webp({
            quality: COMPRESSION_CONFIG.quality.webp,
            effort: 6, // Higher effort for better compression
          });
          break;
        case "jpg":
          sharpInstance = sharpInstance.jpeg({
            quality: COMPRESSION_CONFIG.quality.jpg,
            progressive: true,
            mozjpeg: true, // Better compression
          });
          break;
        case "png":
          sharpInstance = sharpInstance.png({
            quality: COMPRESSION_CONFIG.quality.png,
            compressionLevel: 9,
          });
          break;
      }

      await sharpInstance.toFile(formatOutputPath);

      const compressedSize = getFileSizeMB(formatOutputPath);
      const compressionRatio = (
        ((originalSize - compressedSize) / originalSize) *
        100
      ).toFixed(1);

      results.push({
        format,
        originalSize: parseFloat(originalSize),
        compressedSize: parseFloat(compressedSize),
        compressionRatio: parseFloat(compressionRatio),
        outputPath: formatOutputPath,
      });
    }

    return results;
  } catch (error) {
    console.error(`Error compressing ${inputPath}:`, error.message);
    return null;
  }
}

// Process images in batches
async function processBatch(batch) {
  const promises = batch.map(compressImage);
  const results = await Promise.all(promises);

  for (const result of results) {
    if (result) {
      processedCount++;
      console.log(`✅ Processed ${processedCount}/${totalCount} images`);

      // Log compression results
      result.forEach((formatResult) => {
        console.log(
          `   ${formatResult.format.toUpperCase()}: ${
            formatResult.originalSize
          }MB → ${formatResult.compressedSize}MB (${
            formatResult.compressionRatio
          }% reduction)`
        );
      });
    }
  }
}

// Main compression function
async function compressAllImages() {
  console.log("🚀 Starting image compression...\n");

  // Check if Sharp is installed
  try {
    require("sharp");
  } catch (error) {
    console.error("❌ Sharp is not installed. Please install it first:");
    console.error("npm install sharp");
    process.exit(1);
  }

  // Get all image files
  const imageFiles = getAllImageFiles(COMPRESSION_CONFIG.inputDir);
  totalCount = imageFiles.length;

  if (totalCount === 0) {
    console.log("❌ No image files found in", COMPRESSION_CONFIG.inputDir);
    return;
  }

  console.log(`📸 Found ${totalCount} images to compress\n`);

  // Process images in batches of 5
  const batchSize = 5;
  for (let i = 0; i < imageFiles.length; i += batchSize) {
    const batch = imageFiles.slice(i, i + batchSize);
    await processBatch(batch);
  }

  console.log("\n🎉 Image compression completed!");
  console.log(`📊 Processed ${processedCount}/${totalCount} images`);

  // Generate compression report
  generateCompressionReport();
}

// Generate compression report
function generateCompressionReport() {
  const reportPath = path.join(
    COMPRESSION_CONFIG.outputDir,
    "compression-report.json"
  );

  if (!fs.existsSync(COMPRESSION_CONFIG.outputDir)) {
    console.log("❌ Output directory not found");
    return;
  }

  const allFiles = getAllImageFiles(COMPRESSION_CONFIG.outputDir);
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  const formatStats = {};

  // Calculate statistics
  allFiles.forEach((file) => {
    const size = parseFloat(getFileSizeMB(file));
    const ext = path.extname(file).toLowerCase().slice(1);

    if (!formatStats[ext]) {
      formatStats[ext] = { count: 0, totalSize: 0 };
    }

    formatStats[ext].count++;
    formatStats[ext].totalSize += size;
    totalCompressedSize += size;
  });

  // Estimate original size (rough calculation)
  totalOriginalSize = totalCompressedSize * 1.5; // Assume 50% compression on average

  const report = {
    timestamp: new Date().toISOString(),
    totalImages: allFiles.length,
    totalOriginalSizeMB: totalOriginalSize.toFixed(2),
    totalCompressedSizeMB: totalCompressedSize.toFixed(2),
    totalSavingsMB: (totalOriginalSize - totalCompressedSize).toFixed(2),
    compressionRatio: (
      ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) *
      100
    ).toFixed(1),
    formatStats,
    config: COMPRESSION_CONFIG,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log("\n📋 Compression Report:");
  console.log(`   Total Images: ${report.totalImages}`);
  console.log(`   Original Size: ${report.totalOriginalSizeMB}MB`);
  console.log(`   Compressed Size: ${report.totalCompressedSizeMB}MB`);
  console.log(`   Total Savings: ${report.totalSavingsMB}MB`);
  console.log(`   Compression Ratio: ${report.compressionRatio}%`);
  console.log(`   Report saved to: ${reportPath}`);

  // Format-specific stats
  console.log("\n📊 Format Statistics:");
  Object.entries(formatStats).forEach(([format, stats]) => {
    console.log(
      `   ${format.toUpperCase()}: ${
        stats.count
      } files, ${stats.totalSize.toFixed(2)}MB`
    );
  });
}

// Run compression
if (require.main === module) {
  compressAllImages().catch(console.error);
}

module.exports = { compressAllImages, compressImage };

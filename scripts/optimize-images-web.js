// Web-based image optimization using Canvas API
// This script can be run in the browser to optimize images

class ImageOptimizer {
  constructor() {
    this.maxWidth = 1920;
    this.maxHeight = 1080;
    this.quality = 0.75; // 75% quality
    this.formats = ["webp", "jpeg"];
  }

  // Resize image while maintaining aspect ratio
  resizeImage(canvas, ctx, image, maxWidth, maxHeight) {
    const { width, height } = image;
    let newWidth = width;
    let newHeight = height;

    // Calculate new dimensions
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      newWidth = width * ratio;
      newHeight = height * ratio;
    }

    // Set canvas size
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Draw resized image
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
  }

  // Convert image to WebP format
  async toWebP(canvas, quality = 0.8) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/webp", quality);
    });
  }

  // Convert image to JPEG format
  async toJPEG(canvas, quality = 0.75) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", quality);
    });
  }

  // Optimize single image
  async optimizeImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = async () => {
        try {
          // Resize image
          this.resizeImage(canvas, ctx, img, this.maxWidth, this.maxHeight);

          // Create optimized versions
          const webpBlob = await this.toWebP(canvas, 0.8);
          const jpegBlob = await this.toJPEG(canvas, this.quality);

          // Calculate compression ratios
          const originalSize = file.size;
          const webpSize = webpBlob.size;
          const jpegSize = jpegBlob.size;

          resolve({
            original: {
              name: file.name,
              size: originalSize,
              type: file.type,
            },
            webp: {
              blob: webpBlob,
              size: webpSize,
              compressionRatio: (
                ((originalSize - webpSize) / originalSize) *
                100
              ).toFixed(1),
            },
            jpeg: {
              blob: jpegBlob,
              size: jpegSize,
              compressionRatio: (
                ((originalSize - jpegSize) / originalSize) *
                100
              ).toFixed(1),
            },
          });
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }

  // Optimize multiple images
  async optimizeImages(files) {
    const results = [];

    for (const file of files) {
      try {
        const result = await this.optimizeImage(file);
        results.push(result);
      } catch (error) {
        console.error(`Error optimizing ${file.name}:`, error);
      }
    }

    return results;
  }

  // Download optimized images
  downloadOptimizedImages(results) {
    results.forEach((result) => {
      // Download WebP version
      const webpUrl = URL.createObjectURL(result.webp.blob);
      const webpLink = document.createElement("a");
      webpLink.href = webpUrl;
      webpLink.download = result.original.name.replace(/\.[^/.]+$/, ".webp");
      webpLink.click();
      URL.revokeObjectURL(webpUrl);

      // Download JPEG version
      const jpegUrl = URL.createObjectURL(result.jpeg.blob);
      const jpegLink = document.createElement("a");
      jpegLink.href = jpegUrl;
      jpegLink.download = result.original.name.replace(
        /\.[^/.]+$/,
        "_optimized.jpg"
      );
      jpegLink.click();
      URL.revokeObjectURL(jpegUrl);
    });
  }

  // Generate optimization report
  generateReport(results) {
    let totalOriginalSize = 0;
    let totalWebpSize = 0;
    let totalJpegSize = 0;

    results.forEach((result) => {
      totalOriginalSize += result.original.size;
      totalWebpSize += result.webp.size;
      totalJpegSize += result.jpeg.size;
    });

    const webpSavings = (
      ((totalOriginalSize - totalWebpSize) / totalOriginalSize) *
      100
    ).toFixed(1);
    const jpegSavings = (
      ((totalOriginalSize - totalJpegSize) / totalOriginalSize) *
      100
    ).toFixed(1);

    return {
      totalImages: results.length,
      totalOriginalSizeMB: (totalOriginalSize / (1024 * 1024)).toFixed(2),
      totalWebpSizeMB: (totalWebpSize / (1024 * 1024)).toFixed(2),
      totalJpegSizeMB: (totalJpegSize / (1024 * 1024)).toFixed(2),
      webpSavings,
      jpegSavings,
      results,
    };
  }
}

// Usage example
function setupImageOptimizer() {
  const optimizer = new ImageOptimizer();
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.multiple = true;
  fileInput.accept = "image/*";

  fileInput.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log(`Optimizing ${files.length} images...`);

    const results = await optimizer.optimizeImages(files);
    const report = optimizer.generateReport(results);

    console.log("Optimization Report:", report);

    // Download optimized images
    optimizer.downloadOptimizedImages(results);
  });

  // Add to page
  document.body.appendChild(fileInput);

  // Create button to trigger file selection
  const button = document.createElement("button");
  button.textContent = "Select Images to Optimize";
  button.onclick = () => fileInput.click();
  document.body.appendChild(button);
}

// Auto-setup if running in browser
if (typeof window !== "undefined") {
  setupImageOptimizer();
}

// Export for module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = ImageOptimizer;
}

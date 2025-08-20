#!/usr/bin/env node

/**
 * Image Optimization Script
 * This script helps optimize images for better web performance
 * 
 * Usage: node scripts/optimize-images.js
 * 
 * Requirements:
 * - Install sharp: npm install sharp
 * - Place images in public/media/ directory
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const config = {
  inputDir: 'public/media',
  outputDir: 'public/media/optimized',
  formats: ['webp', 'avif'],
  quality: 85,
  maxWidth: 1920,
  maxHeight: 1080,
  sizes: [
    { width: 640, suffix: '-sm' },
    { width: 1280, suffix: '-md' },
    { width: 1920, suffix: '-lg' }
  ]
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Resize if needed
    if (metadata.width > options.maxWidth || metadata.height > options.maxHeight) {
      image.resize(options.maxWidth, options.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Apply format-specific optimizations
    if (options.format === 'webp') {
      await image
        .webp({ quality: options.quality })
        .toFile(outputPath);
    } else if (options.format === 'avif') {
      await image
        .avif({ quality: options.quality })
        .toFile(outputPath);
    }
    
    console.log(`✓ Optimized: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message);
  }
}

async function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (stat.isFile() && /\.(jpg|jpeg|png|gif|bmp)$/i.test(item)) {
      const relativePath = path.relative(config.inputDir, fullPath);
      const outputBase = path.join(config.outputDir, relativePath);
      const outputDir = path.dirname(outputBase);
      
      // Ensure output subdirectory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Generate optimized versions
      for (const format of config.formats) {
        const outputPath = outputBase.replace(/\.[^/.]+$/, `.${format}`);
        await optimizeImage(fullPath, outputPath, {
          format,
          quality: config.quality,
          maxWidth: config.maxWidth,
          maxHeight: config.maxHeight
        });
      }
      
      // Generate responsive sizes
      for (const size of config.sizes) {
        for (const format of config.formats) {
          const outputPath = outputBase.replace(/\.[^/.]+$/, `${size.suffix}.${format}`);
          await optimizeImage(fullPath, outputPath, {
            format,
            quality: config.quality,
            maxWidth: size.width,
            maxHeight: Math.round(size.width * 0.75) // Maintain aspect ratio
          });
        }
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  
  if (!fs.existsSync(config.inputDir)) {
    console.error(`❌ Input directory not found: ${config.inputDir}`);
    process.exit(1);
  }
  
  try {
    await processDirectory(config.inputDir);
    console.log('\n✨ Image optimization completed!');
    console.log(`📁 Optimized images saved to: ${config.outputDir}`);
    console.log('\n💡 Next steps:');
    console.log('1. Update your components to use the optimized images');
    console.log('2. Consider implementing responsive images with srcset');
    console.log('3. Test performance improvements with Lighthouse');
  } catch (error) {
    console.error('\n❌ Optimization failed:', error.message);
    process.exit(1);
  }
}

// Check if sharp is installed
try {
  require('sharp');
  main();
} catch (error) {
  console.error('❌ Sharp package not found. Please install it first:');
  console.error('npm install sharp');
  process.exit(1);
}

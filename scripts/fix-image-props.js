#!/usr/bin/env node

/**
 * Fix Legacy Next.js Image Props Script
 * Updates layout="fill" and objectFit="cover" to the new Next.js 13+ format
 * Run: node scripts/fix-image-props.js
 */

const fs = require('fs');
const path = require('path');

// Function to fix image props in a file
function fixImagePropsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Replace layout="fill" and objectFit="cover" with the new format
  const oldPattern = /(<Image[^>]*)\s+layout="fill"\s+objectFit="cover"([^>]*>)/g;
  const newContent = content.replace(oldPattern, (match, beforeProps, afterProps) => {
    changed = true;
    return `${beforeProps} fill${afterProps}`;
  });
  
  // Handle cases where only layout="fill" exists
  const layoutOnlyPattern = /(<Image[^>]*)\s+layout="fill"([^>]*>)/g;
  const finalContent = newContent.replace(layoutOnlyPattern, (match, beforeProps, afterProps) => {
    // Check if this already has 'fill' prop (from previous replacement)
    if (beforeProps.includes(' fill') || afterProps.includes(' fill')) {
      return match; // Already fixed
    }
    changed = true;
    return `${beforeProps} fill${afterProps}`;
  });
  
  // Handle standalone objectFit="cover" (should be style prop now)
  const objectFitPattern = /\s+objectFit="cover"/g;
  const result = finalContent.replace(objectFitPattern, (match) => {
    // Only replace if not already handled by fill replacement
    if (!changed) {
      return ' style={{ objectFit: "cover" }}';
    }
    return ''; // Remove standalone objectFit as it's handled by fill
  });
  
  if (changed || result !== content) {
    fs.writeFileSync(filePath, result);
    console.log(`✅ Updated: ${filePath}`);
    return true;
  }
  return false;
}

// Function to recursively find and process files
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let totalFixed = 0;
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      totalFixed += processDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('layout="fill"') || content.includes('objectFit="cover"')) {
        if (fixImagePropsInFile(fullPath)) {
          totalFixed++;
        }
      }
    }
  });
  
  return totalFixed;
}

// Main execution
console.log('🖼️  Starting Next.js Image props migration...\n');

// Process the src directory
const srcDir = path.join(__dirname, '..', 'src');
const totalFixed = processDirectory(srcDir);

console.log(`\n✨ Image props migration completed!`);
console.log(`📝 Summary: Updated ${totalFixed} files`);
console.log('\n🔧 Changes made:');
console.log('   • layout="fill" + objectFit="cover" → fill');
console.log('   • Standalone layout="fill" → fill');
console.log('   • Removed legacy objectFit props');
console.log('\n💡 Tip: Restart your dev server to see the changes!'); 
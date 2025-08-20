#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Validates the documentation structure
 */

const REQUIRED_FILES = {
  'Barovia Paranormal': ['getting-started.md'],
};

const DOCS_DIR = path.join(__dirname, '..', 'docs');

function validateStructure() {
  console.log('🔍 Validating documentation structure...\n');
  
  let hasErrors = false;

  // Check if docs directory exists
  if (!fs.existsSync(DOCS_DIR)) {
    console.error('❌ docs/ directory not found');
    return false;
  }

  // Check each product directory
  Object.keys(REQUIRED_FILES).forEach(product => {
    const productDir = path.join(DOCS_DIR, product);
    
    console.log(`Checking ${product}/ directory...`);
    
    if (!fs.existsSync(productDir)) {
      console.error(`❌ Missing directory: docs/${product}/`);
      hasErrors = true;
      return;
    }

    // Check required files
    REQUIRED_FILES[product].forEach(file => {
      const filePath = path.join(productDir, file);
      
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Missing file: docs/${product}/${file}`);
        hasErrors = true;
      } else {
        // Check if file has content
        const stats = fs.statSync(filePath);
        if (stats.size < 100) { // Less than 100 bytes is likely just a stub
          console.warn(`⚠️  File appears to be a stub: docs/${product}/${file}`);
        } else {
          console.log(`✅ docs/${product}/${file}`);
        }
      }
    });
  });

  // Check for assets directory
  const assetsDir = path.join(DOCS_DIR, 'assets');
  if (!fs.existsSync(assetsDir)) {
    console.warn('⚠️  No assets/ directory found');
  } else {
    console.log('✅ assets/ directory exists');
  }

  // Check for shared directory
  const sharedDir = path.join(DOCS_DIR, 'shared');
  if (!fs.existsSync(sharedDir)) {
    console.warn('⚠️  No shared/ directory found');
  } else {
    console.log('✅ shared/ directory exists');
  }

  console.log('\n' + '='.repeat(50));
  
  if (hasErrors) {
    console.error('❌ Structure validation failed');
    process.exit(1);
  } else {
    console.log('✅ Documentation structure is valid');
  }
}

// Validate image references
function validateImageReferences() {
  console.log('\n🖼️  Validating image references...\n');
  
  const markdownFiles = [];
  
  function findMarkdownFiles(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && item !== 'node_modules' && item !== '.git') {
        findMarkdownFiles(fullPath);
      } else if (item.endsWith('.md')) {
        markdownFiles.push(fullPath);
      }
    });
  }
  
  findMarkdownFiles(path.join(__dirname, '..'));
  
  let imageErrors = false;
  
  markdownFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = imageRegex.exec(content)) !== null) {
      const altText = match[1];
      const imagePath = match[2];
      
      // Skip external URLs
      if (imagePath.startsWith('http')) {
        continue;
      }
      
      // Check if alt text exists
      if (!altText || altText.trim() === '') {
        console.error(`❌ Missing alt text for image: ${imagePath} in ${file}`);
        imageErrors = true;
      }
      
      // Check if image file exists
      let fullImagePath;
      if (imagePath.startsWith('../')) {
        fullImagePath = path.resolve(path.dirname(file), imagePath);
      } else if (imagePath.startsWith('./')) {
        fullImagePath = path.resolve(path.dirname(file), imagePath);
      } else {
        fullImagePath = path.resolve(path.dirname(file), imagePath);
      }
      
      if (!fs.existsSync(fullImagePath)) {
        console.error(`❌ Image not found: ${imagePath} (referenced in ${file})`);
        imageErrors = true;
      }
    }
  });
  
  if (imageErrors) {
    console.error('\n❌ Image validation failed');
    process.exit(1);
  } else {
    console.log('✅ All image references are valid');
  }
}

if (require.main === module) {
  validateStructure();
  validateImageReferences();
}

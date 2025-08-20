#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

const ASSETS_DIR = path.join(__dirname, '..', 'docs', 'assets', 'images');
const MAX_WIDTH = 1200;
const QUALITY_JPEG = 80;
const QUALITY_PNG = [0.6, 0.8];

async function optimizeImages() {
  console.log('🖼️  Optimizing images...\n');
  
  if (!fs.existsSync(ASSETS_DIR)) {
    console.log('No images directory found, skipping optimization');
    return;
  }

  try {
    const files = await imagemin([`${ASSETS_DIR}/**/*.{jpg,jpeg,png,svg}`], {
      destination: ASSETS_DIR,
      plugins: [
        imageminMozjpeg({ quality: QUALITY_JPEG }),
        imageminPngquant({ quality: QUALITY_PNG }),
        imageminSvgo({
          plugins: [
            { name: 'removeViewBox', active: false },
            { name: 'addAttributesToSVGElement', params: { attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }] } }
          ]
        })
      ]
    });

    console.log(`✅ Optimized ${files.length} images`);
    
    files.forEach(file => {
      console.log(`   - ${path.relative(process.cwd(), file.destinationPath)}`);
    });

  } catch (error) {
    console.error('❌ Image optimization failed:', error.message);
    process.exit(1);
  }
}

function checkImageSizes() {
  console.log('\n📏 Checking image sizes...\n');
  
  const largeImages = [];
  const veryLargeImages = [];
  
  function checkDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        checkDirectory(fullPath);
      } else if (/\.(jpg|jpeg|png|gif)$/i.test(item)) {
        const sizeInMB = stat.size / (1024 * 1024);
        
        if (sizeInMB > 5) {
          veryLargeImages.push({ path: fullPath, size: sizeInMB });
        } else if (sizeInMB > 1) {
          largeImages.push({ path: fullPath, size: sizeInMB });
        }
      }
    });
  }
  
  if (fs.existsSync(ASSETS_DIR)) {
    checkDirectory(ASSETS_DIR);
  }
  
  if (veryLargeImages.length > 0) {
    console.error('❌ Very large images found (>5MB):');
    veryLargeImages.forEach(img => {
      console.error(`   ${path.relative(process.cwd(), img.path)} - ${img.size.toFixed(2)}MB`);
    });
    process.exit(1);
  }
  
  if (largeImages.length > 0) {
    console.warn('⚠️  Large images found (>1MB):');
    largeImages.forEach(img => {
      console.warn(`   ${path.relative(process.cwd(), img.path)} - ${img.size.toFixed(2)}MB`);
    });
    console.warn('   Consider optimizing these images');
  }
  
  console.log('✅ Image size check complete');
}

if (require.main === module) {
  checkImageSizes();
  optimizeImages().catch(console.error);
}

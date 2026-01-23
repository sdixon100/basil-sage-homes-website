import sharp from 'sharp';

async function optimizeImage() {
  try {
    await sharp('charleston-sc.png')
      .webp({ quality: 80 })
      .toFile('charleston-sc.webp');
    console.log('Image optimized successfully');
  } catch (err) {
    console.error('Error optimizing image:', err);
  }
}

optimizeImage();

import sharp from 'sharp';

async function optimizeImage() {
  try {
    await sharp('public/charleston-sc.png')
      .webp({ quality: 65 })
      .toFile('public/charleston-sc.webp');
    console.log('Image optimized successfully');
  } catch (err) {
    console.error('Error optimizing image:', err);
  }
}

optimizeImage();

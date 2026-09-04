const { Jimp } = require("jimp");

async function resizeImages() {
  try {
    const image = await Jimp.read("public/assets/logo.png");
    
    const img192 = image.clone();
    await img192.resize({ w: 192, h: 192 });
    await img192.write("public/assets/logo-192x192.png");
    console.log("Created 192x192");

    const img512 = image.clone();
    await img512.resize({ w: 512, h: 512 });
    await img512.write("public/assets/logo-512x512.png");
    console.log("Created 512x512");
  } catch (err) {
    console.error("Error resizing:", err);
  }
}

resizeImages();

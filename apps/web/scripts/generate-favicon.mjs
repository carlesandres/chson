import { favicons } from "favicons";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateFavicon() {
  const source = path.join(__dirname, "app", "icon.svg");
  const outputDir = path.join(__dirname, "app");
  
  const config = {
    path: "/",
    appName: "ChSON",
    appShortName: "ChSON",
    appDescription: "A JSON format for writing software cheatsheets",
    background: "#0B5BD3",
    theme_color: "#0B5BD3",
    icons: {
      favicons: true,
      android: false,
      appleIcon: false,
      appleStartup: false,
      coast: false,
      firefox: false,
      windows: false,
      yandex: false,
    },
  };

  try {
    const result = await favicons(source, config);
    
    // Find the ICO file in the result
    const icoFile = result.files.find(f => f.name === "favicon.ico");
    if (icoFile) {
      await fs.writeFile(path.join(outputDir, "favicon.ico"), icoFile.contents);
      console.log("✓ Generated favicon.ico from icon.svg");
    } else {
      // Fallback: use images if files array doesn't have it
      const icoImage = result.images.find(img => img.name === "favicon.ico");
      if (icoImage) {
        await fs.writeFile(path.join(outputDir, "favicon.ico"), icoImage.contents);
        console.log("✓ Generated favicon.ico from icon.svg");
      }
    }
  } catch (error) {
    console.error("Error generating favicon:", error);
    process.exit(1);
  }
}

generateFavicon();

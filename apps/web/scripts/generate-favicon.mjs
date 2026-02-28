import { favicons } from "favicons";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

async function generateFavicon() {
  const source = path.join(projectRoot, "app", "icon.svg");
  const outputDir = path.join(projectRoot, "app");

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
      appleIcon: true,
      appleStartup: false,
      coast: false,
      firefox: false,
      windows: false,
      yandex: false,
    },
  };

  try {
    const result = await favicons(source, config);

    const icoFile = result.files.find((f) => f.name === "favicon.ico");
    if (icoFile) {
      await fs.writeFile(path.join(outputDir, "favicon.ico"), icoFile.contents);
      console.log("✓ Generated favicon.ico from icon.svg");
    } else {
      const icoImage = result.images.find((img) => img.name === "favicon.ico");
      if (icoImage) {
        await fs.writeFile(path.join(outputDir, "favicon.ico"), icoImage.contents);
        console.log("✓ Generated favicon.ico from icon.svg");
      }
    }

    const appleIcon = result.images.find(
      (img) =>
        img.name === "apple-touch-icon.png" ||
        img.name === "apple-touch-icon-180x180.png",
    );

    if (appleIcon) {
      await fs.writeFile(path.join(outputDir, "apple-icon.png"), appleIcon.contents);
      console.log("✓ Generated apple-icon.png from icon.svg");
    }
  } catch (error) {
    console.error("Error generating favicon:", error);
    process.exit(1);
  }
}

generateFavicon();

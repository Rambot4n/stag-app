import { createCanvas } from "canvas";
import { writeFileSync, mkdirSync } from "fs";

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Amber background
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(0, 0, size, size);

  // Beer emoji
  const fontSize = Math.round(size * 0.6);
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🍺", size / 2, size / 2);

  return canvas.toBuffer("image/png");
}

mkdirSync("public/icons", { recursive: true });
writeFileSync("public/icons/icon-192.png", generateIcon(192));
console.log("✓ icon-192.png");
writeFileSync("public/icons/icon-512.png", generateIcon(512));
console.log("✓ icon-512.png");
writeFileSync("public/icons/apple-touch-icon.png", generateIcon(180));
console.log("✓ apple-touch-icon.png");

import { createCanvas, loadImage } from "canvas";
import { writeFileSync, mkdirSync } from "fs";

const EMOJI_URL = "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f37a.png";

async function generateIcon(size, emojiImg) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Amber background
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(0, 0, size, size);

  // Emoji centred at 60% of icon size
  const emojiSize = Math.round(size * 0.6);
  const offset = Math.round((size - emojiSize) / 2);
  ctx.drawImage(emojiImg, offset, offset, emojiSize, emojiSize);

  return canvas.toBuffer("image/png");
}

const emojiImg = await loadImage(EMOJI_URL);

mkdirSync("public/icons", { recursive: true });
writeFileSync("public/icons/icon-192.png", await generateIcon(192, emojiImg));
console.log("✓ icon-192.png");
writeFileSync("public/icons/icon-512.png", await generateIcon(512, emojiImg));
console.log("✓ icon-512.png");
writeFileSync("public/icons/apple-touch-icon.png", await generateIcon(180, emojiImg));
console.log("✓ apple-touch-icon.png");

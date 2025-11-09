#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, loadImage, registerFont } from "canvas";

// Image dimensions for social sharing (Twitter/OpenGraph)
const WIDTH = 1200;
const HEIGHT = 630;

// Colors and styling
const BACKGROUND_COLOR = "#f8f8f8";
const PRIMARY_TEXT_COLOR = "#000000";
const SECONDARY_TEXT_COLOR = "#666666";
const BRAND_COLOR = "#000000";

interface PostData {
  title: string;
  date: string;
}

export async function generateMetaImage(post: PostData): Promise<Buffer> {
  // Register Inter fonts
  try {
    const interRegularPath = path.join(
      process.cwd(),
      "assets/fonts/Inter-Regular.ttf",
    );
    const interBoldPath = path.join(
      process.cwd(),
      "assets/fonts/Inter-Bold.ttf",
    );

    registerFont(interRegularPath, { family: "Inter", weight: "normal" });
    registerFont(interBoldPath, { family: "Inter", weight: "bold" });
  } catch (_error) {
    console.log("Inter font registration failed, using Arial fallback");
  }

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Load and draw avatar
  try {
    const avatarPath = path.join(
      process.cwd(),
      "public/static/images/photo.png",
    );
    const avatar = await loadImage(avatarPath);
    const avatarSize = 80;
    const avatarX = WIDTH - 120;
    const avatarY = 40;

    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
  } catch (_error: any) {
    // Fallback: draw a simple circle if avatar can't be loaded
    const avatarSize = 80;
    const avatarX = WIDTH - 80;
    const avatarY = 80;

    ctx.fillStyle = "#4a90e2";
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarSize / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Name text "naps62" - to the left of photo
  ctx.fillStyle = BRAND_COLOR;
  ctx.font = "bold 48px Inter";
  ctx.textAlign = "right";
  ctx.fillText("naps62.com", WIDTH - 140, 100); // Position to left of photo, vertically centered with it

  // Post metadata - align with avatar top
  ctx.fillStyle = SECONDARY_TEXT_COLOR;
  ctx.font = "32px Inter";
  ctx.textAlign = "left";

  const metaY = 80; // Start at same Y as avatar (40 + 25 for text baseline)
  const metaX = 80;

  ctx.fillText("Blog post", metaX, metaY);

  // Format date
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  ctx.fillText(`${formattedDate}`, metaX, metaY + 35);

  // Post title
  ctx.fillStyle = PRIMARY_TEXT_COLOR;
  ctx.font = "bold 72px Inter";
  ctx.textAlign = "left";

  // Word wrap for long titles
  const titleWords = post.title.split(" ");
  const maxWidth = WIDTH - 160;
  let line = "";
  const lines: string[] = [];

  for (const word of titleWords) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== "") {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  // Draw title lines at the bottom
  const titleStartY = HEIGHT - 180; // Start near bottom
  const lineHeight = 85;

  for (let i = 0; i < Math.min(lines.length, 2); i++) {
    let text = lines[i];
    if (i === 1 && lines.length > 2) {
      text = text.substring(0, text.length - 3) + "...";
    }
    ctx.fillText(text, metaX, titleStartY + i * lineHeight);
  }

  return canvas.toBuffer("image/png");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log("This script is now integrated into build-banners.ts");
  console.log("Run 'yarn banners' to generate missing meta images");
}

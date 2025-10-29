#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, loadImage, registerFont } from "canvas";
import type { Post } from "../src/utils/posts.js";
import { getAllPosts } from "../src/utils/posts.js";

const WIDTH = 1200;
const HEIGHT = 630;
const POSTS_DIR = path.join(process.cwd(), "src", "posts");
const OUTPUT_ROOT = path.join(process.cwd(), "public", "posts");
const MANIFEST_DIR = path.join(process.cwd(), "src", "generated");
const MANIFEST_PATH = path.join(MANIFEST_DIR, "banner-manifest.ts");

const FALLBACK_IMAGE_NAME = "auto-meta.png";
const CUSTOM_IMAGE_NAME = "banner.png";
const META_IMAGE_NAME = "meta.png";

type BannerRecord = {
  slug: string;
  relativePath: string;
};

function ensureDir(dir: string, empty = false) {
  if (empty && fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function existingFile(...segments: string[]): string | null {
  const candidate = path.join(...segments);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }
  return null;
}

async function registerFonts() {
  try {
    const baseDir = process.cwd();
    registerFont(path.join(baseDir, "assets", "fonts", "Inter-Regular.ttf"), {
      family: "Inter",
      weight: "normal",
    });
    registerFont(path.join(baseDir, "assets", "fonts", "Inter-Bold.ttf"), {
      family: "Inter",
      weight: "bold",
    });
  } catch {
    // Fonts optional during generation; Canvas will fall back.
  }
}

async function generateBannerImage(post: Post): Promise<Buffer> {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f8f8f8";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  try {
    const avatarPath = path.join(
      process.cwd(),
      "public",
      "static",
      "images",
      "photo.png",
    );
    const avatar = await loadImage(avatarPath);
    const size = 80;
    ctx.drawImage(avatar, WIDTH - 120, 40, size, size);
  } catch {
    ctx.fillStyle = "#4a90e2";
    ctx.beginPath();
    ctx.arc(WIDTH - 80, 80, 40, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.fillStyle = "#000000";
  ctx.font = "bold 48px Inter";
  ctx.textAlign = "right";
  ctx.fillText("naps62.com", WIDTH - 140, 100);

  ctx.fillStyle = "#666666";
  ctx.font = "32px Inter";
  ctx.textAlign = "left";
  ctx.fillText("Blog post", 80, 80);

  const date = new Date(post.date);
  const formattedDate = isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  if (formattedDate) {
    ctx.fillText(formattedDate, 80, 115);
  }

  ctx.fillStyle = "#000000";
  ctx.font = "bold 72px Inter";
  ctx.textAlign = "left";

  const words = String(post.title ?? "").split(" ");
  const maxWidth = WIDTH - 160;
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const attempted = `${line}${word} `;
    const metrics = ctx.measureText(attempted);
    if (metrics.width > maxWidth && line) {
      lines.push(line.trim());
      line = `${word} `;
    } else {
      line = attempted;
    }
  }
  if (line.trim()) {
    lines.push(line.trim());
  }

  const startY = HEIGHT - 180;
  const lineHeight = 85;
  for (let index = 0; index < Math.min(lines.length, 2); index++) {
    let text = lines[index];
    if (index === 1 && lines.length > 2) {
      text = `${text.slice(0, Math.max(text.length - 3, 0))}...`;
    }
    ctx.fillText(text, 80, startY + index * lineHeight);
  }

  return canvas.toBuffer("image/png");
}

async function processPost(post: Post): Promise<BannerRecord | null> {
  const slug = post.slug;
  const postDir = path.join(POSTS_DIR, slug);
  let buffer: Buffer | null = null;

  const customBanner = existingFile(postDir, CUSTOM_IMAGE_NAME);
  const explicitMeta = customBanner ?? existingFile(postDir, META_IMAGE_NAME);
  const autoMeta = existingFile(postDir, FALLBACK_IMAGE_NAME);

  if (customBanner) {
    buffer = fs.readFileSync(customBanner);
  } else if (explicitMeta) {
    buffer = fs.readFileSync(explicitMeta);
  } else if (autoMeta) {
    buffer = fs.readFileSync(autoMeta);
  } else {
    buffer = await generateBannerImage(post);
    ensureDir(postDir);
    fs.writeFileSync(path.join(postDir, FALLBACK_IMAGE_NAME), buffer);
  }

  if (!buffer) {
    return null;
  }

  const slugDir = path.join(OUTPUT_ROOT, slug);
  ensureDir(slugDir);

  const bannerPath = path.join(slugDir, "banner.png");
  if (fs.existsSync(bannerPath)) {
    fs.rmSync(bannerPath);
  }
  fs.writeFileSync(bannerPath, buffer);

  const legacyBannerPath = path.join(
    process.cwd(),
    "public",
    slug,
    "banner.png",
  );
  if (fs.existsSync(legacyBannerPath)) {
    fs.rmSync(legacyBannerPath);
    const legacyDir = path.dirname(legacyBannerPath);
    const remaining = fs.readdirSync(legacyDir);
    if (remaining.length === 0) {
      fs.rmdirSync(legacyDir);
    }
  }

  return {
    slug,
    relativePath: `/posts/${slug}/banner.png`,
  };
}

function writeManifest(records: BannerRecord[]) {
  ensureDir(MANIFEST_DIR);
  const manifestObject = records.reduce<Record<string, string>>(
    (acc, record) => {
      acc[record.slug] = record.relativePath;
      return acc;
    },
    {},
  );

  const source =
    `export const bannerManifest = ${JSON.stringify(manifestObject, null, 2)} as const;\n\n` +
    `export type BannerManifest = typeof bannerManifest;\n`;

  fs.writeFileSync(MANIFEST_PATH, source);
}

async function main() {
  await registerFonts();

  ensureDir(OUTPUT_ROOT);

  const posts = getAllPosts();
  const results: BannerRecord[] = [];
  for (const post of posts) {
    const record = await processPost(post);
    if (record) {
      results.push(record);
    }
  }
  writeManifest(results);

  console.log(
    `Generated banner assets for ${results.length} post${results.length === 1 ? "" : "s"}.`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

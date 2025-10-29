#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Post } from "../src/utils/posts.js";
import { getAllPosts } from "../src/utils/posts.js";

const POSTS_DIR = path.join(process.cwd(), "src", "posts");
const OUTPUT_ROOT = path.join(process.cwd(), "public", "posts");
const LEGACY_GENERATED_DIR = path.join(process.cwd(), "public", "generated");

const CUSTOM_IMAGE_NAME = "banner.png";
const META_IMAGE_NAME = "meta.png";
const AUTO_META_NAME = "auto-meta.png";

interface BannerRecord {
  slug: string;
  relativePath: string;
}

interface ProcessResult {
  record: BannerRecord;
  wroteFile: boolean;
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function fileIfExists(...segments: string[]): string | null {
  const candidate = path.join(...segments);
  return fs.existsSync(candidate) && fs.statSync(candidate).isFile()
    ? candidate
    : null;
}

function removeLegacyBanner(slug: string) {
  const legacyBannerPath = path.join(
    process.cwd(),
    "public",
    slug,
    "banner.png",
  );
  if (fs.existsSync(legacyBannerPath)) {
    fs.rmSync(legacyBannerPath, { force: true });
    const legacyDir = path.dirname(legacyBannerPath);
    const remaining = fs.readdirSync(legacyDir);
    if (remaining.length === 0) {
      fs.rmdirSync(legacyDir);
    }
  }
}

function removeAutoMeta(postDir: string) {
  const autoMetaPath = path.join(postDir, AUTO_META_NAME);
  if (fs.existsSync(autoMetaPath)) {
    fs.rmSync(autoMetaPath, { force: true });
  }
}

async function processPost(post: Post): Promise<ProcessResult | null> {
  const slug = post.slug;
  const postDir = path.join(POSTS_DIR, slug);
  removeAutoMeta(postDir);

  const slugDir = path.join(OUTPUT_ROOT, slug);
  const bannerPath = path.join(slugDir, "banner.png");

  if (fs.existsSync(bannerPath)) {
    removeLegacyBanner(slug);
    return {
      record: {
        slug,
        relativePath: `/posts/${slug}/banner.png`,
      },
      wroteFile: false,
    };
  }

  const sourcePath =
    fileIfExists(postDir, CUSTOM_IMAGE_NAME) ??
    fileIfExists(postDir, META_IMAGE_NAME);

  if (!sourcePath) {
    console.warn(`Skipping ${slug}: no banner.png or meta.png found`);
    removeLegacyBanner(slug);
    return null;
  }

  ensureDir(slugDir);
  fs.copyFileSync(sourcePath, bannerPath);
  removeLegacyBanner(slug);

  return {
    record: {
      slug,
      relativePath: `/posts/${slug}/banner.png`,
    },
    wroteFile: true,
  };
}

async function main() {
  if (fs.existsSync(LEGACY_GENERATED_DIR)) {
    fs.rmSync(LEGACY_GENERATED_DIR, { recursive: true, force: true });
  }

  ensureDir(OUTPUT_ROOT);

  const posts = getAllPosts();
  const results: BannerRecord[] = [];
  let copied = 0;
  let skipped = 0;

  for (const post of posts) {
    const outcome = await processPost(post);
    if (outcome) {
      results.push(outcome.record);
      if (outcome.wroteFile) {
        copied++;
      }
    } else {
      skipped++;
    }
  }

  console.log(
    `Banners ready: ${results.length} mapped, ${copied} ensured, ${skipped} skipped.`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

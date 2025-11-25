#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "glob";
import matter from "gray-matter";

const SITE_URL = "https://naps.pt";
const SITE_TITLE = "Miguel Palhas";
const SITE_DESCRIPTION =
  "A senior engineer who spends his time solving deep technical challenges in various corners of the web, as well as tinkering with both hardware and software side-projects.";

interface Post {
  directory: string;
  slug: string;
  title: string;
  date: string;
  draft: boolean;
  description?: string;
}

function getAllPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const fileNames = globSync("*/index.mdx", { cwd: postsDirectory });

  const posts = fileNames.map((fileName) => {
    const directory = fileName.replace(/\/index\.mdx$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    const slug = data.slug || directory.replace(/^\d{4}-\d{2}-/, "");

    return {
      directory,
      slug,
      title: data.title,
      date: data.date,
      draft: data.draft || false,
      description: data.description, // Only use frontmatter description if provided
    };
  });

  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function generateRssFeed(posts: Post[]): string {
  const items = posts
    .map((post) => {
      const postUrl = `${SITE_URL}/posts/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      ${post.description ? `<description>${escapeXml(post.description)}</description>` : ""}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

async function main() {
  const posts = getAllPosts();
  const rssFeed = generateRssFeed(posts);

  const outputPath = path.join(process.cwd(), "public", "feed.xml");
  fs.writeFileSync(outputPath, rssFeed, "utf8");

  console.log(
    `✅ RSS feed generated with ${posts.length} posts at ${outputPath}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

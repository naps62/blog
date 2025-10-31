import { ComponentType } from "react";

// Auto-import all MDX posts using Vite's import.meta.glob
const postModules = import.meta.glob<PostModule>("../posts/*/index.mdx", {
  eager: true,
});

export interface Frontmatter {
  draft?: boolean;
  title: string;
  date: string;
  tags: string[];
  canonicalUrl?: string;
}

export interface PostModule {
  default: ComponentType;
  frontmatter: Frontmatter;
}

export interface FrontmatterExtended extends Frontmatter {
  metaImg?: string;
}

export interface Post extends PostModule {
  frontmatter: FrontmatterExtended;
  slug: string;
}

// Extract slug and dir from path and create postEntries
const postEntries = Object.entries(postModules).map(([path, module]) => {
  // Extract directory name from path: ../posts/2025-08-how-i-build-fullstack-ethereum-apps/index.mdx
  const match = path.match(/\.\.\/posts\/(.+)\/index\.mdx$/);
  if (!match) throw new Error(`Invalid post path: ${path}`);

  const dir = match[1];
  // Remove date prefix to create slug: 2025-08-how-i-build-fullstack-ethereum-apps -> how-i-build-fullstack-ethereum-apps
  const slug = dir.replace(/^\d{4}-\d{2}-/, "");

  return {
    ...module,
    slug,
    dir,
  };
});

// Auto-import all metaImg images using Vite's import.meta.glob
const metaImages = import.meta.glob("../posts/*/meta.png", {
  eager: true,
});

// Create slug from filename
const slugs = postEntries.map((entry) => entry.slug);
const slugToDir = Object.fromEntries(
  postEntries.map((entry) => [entry.slug, entry.dir] as const),
);

// Create a slug-based lookup for posts
export function getPostBySlug(slug: string): PostModule | null {
  const index = slugs.indexOf(slug);
  return postEntries[index];
}

// Create metaImg image mapping from glob imports
export function getMetaImgForSlug(slug: string) {
  const dir = slugToDir[slug];
  if (!dir) return undefined;
  const imgPath = `../posts/${dir}/meta.png`;
  const metaImgModule = metaImages[imgPath] as { default: string } | undefined;
  return metaImgModule?.default;
}

// Get all posts sorted by date (newest first)
export function getAllPosts(): Post[] {
  const isDev = import.meta.env.DEV;

  return postEntries
    .filter((post) => isDev || !post.frontmatter.draft)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date || 0);
      const dateB = new Date(b.frontmatter.date || 0);
      return dateB.getTime() - dateA.getTime();
    });
}

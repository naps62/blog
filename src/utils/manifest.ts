import { ComponentType } from "react";

interface PostModule {
  default: ComponentType;
  frontmatter: {
    draft?: boolean;
    title: string;
    date: string;
    tags: string[];
    canonicalUrl?: string;
  };
}

const postModules = import.meta.glob<PostModule>("../posts/*/index.mdx", {
  eager: true,
});

const metaImages = import.meta.glob("../posts/*/meta.png", {
  eager: true,
});

const showDrafts = import.meta.env.DEV;

// Extract slug and dir from path and create posts
export const posts = Object.entries(postModules)
  .map(([path, module]) => {
    // Extract directory name from path: ../posts/2025-08-how-i-build-fullstack-ethereum-apps/index.mdx
    const match = path.match(/\.\.\/posts\/(.+)\/index\.mdx$/);
    if (!match) throw new Error(`Invalid post path: ${path}`);

    const dir = match[1];
    // Remove date prefix
    const slug = dir.replace(/^\d{4}-\d{2}-/, "");

    const imgPath = `../posts/${dir}/meta.png`;
    const metaImg = metaImages[imgPath] as { default: string } | undefined;

    return {
      Mdx: module.default,
      frontmatter: module.frontmatter,
      metaImg: metaImg?.default,
      slug,
      dir,
    };
  })
  .filter((p) => showDrafts || !p.frontmatter.draft)
  .sort((a, b) => {
    const dateA = new Date(a.frontmatter.date || 0);
    const dateB = new Date(b.frontmatter.date || 0);
    return dateB.getTime() - dateA.getTime();
  });

export type Post = (typeof posts)[number];

const slugs = posts.map((entry) => entry.slug);

export function getPost(slug: string) {
  return posts[slugs.indexOf(slug)];
}

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
    // Extract directory name from path
    const match = path.match(/\.\.\/posts\/(.+)\/index\.mdx$/);
    if (!match) throw new Error(`Invalid post path: ${path}`);

    // Remove date prefix
    const dir = match[1];
    const slug = dir.replace(/^\d{4}-\d{2}-/, "");

    const imgPath = `../posts/${dir}/meta.png`;
    const metaImg = (metaImages[imgPath] as { default: string } | undefined)
      ?.default;

    const frontmatter = {
      ...module.frontmatter,
      date: new Date(module.frontmatter.date),
    };

    return {
      Mdx: module.default,
      frontmatter,
      metaImg,
      slug,
      dir,
    };
  })
  .filter((p) => showDrafts || !p.frontmatter.draft)
  .sort((a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime());

export type Post = (typeof posts)[number];

const slugs = posts.map((entry) => entry.slug);

export function getPost(slug: string) {
  return posts[slugs.indexOf(slug)];
}

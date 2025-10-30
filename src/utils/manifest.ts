// Auto-import all MDX posts using Vite's import.meta.glob
const postModules = import.meta.glob("../posts/*/index.mdx", {
  eager: true,
});

// Extract slug and dir from path and create postEntries
const postEntries = Object.entries(postModules).map(([path, module]) => {
  // Extract directory name from path: ../posts/2025-08-how-i-build-fullstack-ethereum-apps/index.mdx
  const match = path.match(/\.\.\/posts\/(.+)\/index\.mdx$/);
  if (!match) throw new Error(`Invalid post path: ${path}`);

  const dir = match[1];
  // Remove date prefix to create slug: 2025-08-how-i-build-fullstack-ethereum-apps -> how-i-build-fullstack-ethereum-apps
  const slug = dir.replace(/^\d{4}-\d{2}-/, "");

  return {
    slug,
    dir,
    module,
  };
});

// Auto-import all metaImg images using Vite's import.meta.glob
const metaImages = import.meta.glob("../posts/*/metaImg.png", {
  eager: true,
});

export const blogManifest = postEntries.map((entry) => entry.module);

// Create slug from filename
const slugs = postEntries.map((entry) => entry.slug);
const slugToDir = Object.fromEntries(
  postEntries.map((entry) => [entry.slug, entry.dir] as const),
);

// Create a slug-based lookup for posts
export const getPostBySlug = (slug: string) => {
  const index = slugs.indexOf(slug);
  if (index === -1) return null;
  return blogManifest[index];
};

// Create metaImg image mapping from glob imports
const getMetaImgForSlug = (slug: string): string | undefined => {
  const dir = slugToDir[slug];
  if (!dir) return undefined;
  const imgPath = `../posts/${dir}/meta.png`;
  const autoImgPath = `../posts/${dir}/auto-meta.png`;
  const metaImgModule = (metaImages[imgPath] || metaImages[autoImgPath]) as
    | { default: string }
    | undefined;
  return metaImgModule?.default;
};

// Get all posts sorted by date (newest first)
export const getAllPosts = () => {
  const isDev = import.meta.env.DEV;

  return postEntries
    .map(({ module, slug }) => ({
      ...module,
      frontmatter: {
        ...module.frontmatter,
        slug,
        metaImg: getMetaImgForSlug(slug),
      },
    }))
    .filter((post) => isDev || !post.frontmatter.draft)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date || 0);
      const dateB = new Date(b.frontmatter.date || 0);
      return dateB.getTime() - dateA.getTime();
    });
};

// Enhanced getPostBySlug to include metaImg image
export const getPostBySlugEnhanced = (slug: string) => {
  const post = getPostBySlug(slug);
  if (!post) return null;

  return {
    ...post,
    frontmatter: {
      ...post.frontmatter,
      metaImg: getMetaImgForSlug(slug),
    },
  };
};

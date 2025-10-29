// Import all MDX posts
import * as continuousStuff from "../posts/continuous-stuff-with-github-actions/index.mdx";
import * as easilyMerging from "../posts/easily-merging-pull-requests/index.mdx";
import * as ethereumNode from "../posts/ethereum-node-setup-reth-systemd/index.mdx";
import * as flagsSeeds from "../posts/flags-seeds-and-idempotency-elixir/index.mdx";
import * as howIBuildFullstackEthereumApps from "../posts/how-i-build-fullstack-ethereum-apps/index.mdx";
import * as knowledgeBase from "../posts/knowledge-base/index.mdx";
import * as metaprogramming from "../posts/metaprogramming-from-c-to-elixir/index.mdx";
import * as perfectingCss from "../posts/perfecting-a-css-3d-animation/index.mdx";
import * as pouringProtocols from "../posts/pouring-protocols-in-elixir/index.mdx";
import * as routingPhoenix from "../posts/routing-in-phoenix-umbrella-apps/index.mdx";
import * as smarterHeredoc from "../posts/smarter-heredoc-syntax-in-vim/index.mdx";
import * as superPoweredVim1 from "../posts/super-powered-vim-i-projections/index.mdx";
import * as superPoweredVim2 from "../posts/super-powered-vim-ii-snippets/index.mdx";
import * as superPoweredVim3 from "../posts/super-powered-vim-iii-skeletons/index.mdx";
import * as tutorialDeploying from "../posts/tutorial-deploying-elixir-applications/index.mdx";
import * as typespecs from "../posts/typespecs-and-behaviours-in-elixir/index.mdx";
import * as understandingGenstage from "../posts/understanding-elixirs-genstage/index.mdx";
import * as unityMeetsRust from "../posts/unity-meets-rust/index.mdx";

// Auto-import all metaImg images using Vite's import.meta.glob
const metaImages = import.meta.glob("../posts/*/metaImg.png", {
  eager: true,
});

export const blogManifest = [
  continuousStuff,
  easilyMerging,
  ethereumNode,
  flagsSeeds,
  knowledgeBase,
  metaprogramming,
  perfectingCss,
  pouringProtocols,
  routingPhoenix,
  smarterHeredoc,
  superPoweredVim1,
  superPoweredVim2,
  superPoweredVim3,
  tutorialDeploying,
  typespecs,
  understandingGenstage,
  unityMeetsRust,
  howIBuildFullstackEthereumApps,
];

// Create slug from filename
const slugs = [
  "continuous-stuff-with-github-actions",
  "easily-merging-pull-requests",
  "ethereum-node-setup-reth-systemd",
  "flags-seeds-and-idempotency-elixir",
  "knowledge-base",
  "metaprogramming-from-c-to-elixir",
  "perfecting-a-css-3d-animation",
  "pouring-protocols-in-elixir",
  "routing-in-phoenix-umbrella-apps",
  "smarter-heredoc-syntax-in-vim",
  "super-powered-vim-i-projections",
  "super-powered-vim-ii-snippets",
  "super-powered-vim-iii-skeletons",
  "tutorial-deploying-elixir-applications",
  "typespecs-and-behaviours-in-elixir",
  "understanding-elixirs-genstage",
  "unity-meets-rust",
  "how-i-build-fullstack-ethereum-apps",
];

// Create a slug-based lookup for posts
export const getPostBySlug = (slug: string) => {
  const index = slugs.indexOf(slug);
  if (index === -1) return null;
  return blogManifest[index];
};

// Create metaImg image mapping from glob imports
const getMetaImgForSlug = (slug: string): string | undefined => {
  const imgPath = `../posts/${slug}/meta.png`;
  const autoImgPath = `../posts/${slug}/auto-meta.png`;
  const metaImgModule = (metaImages[imgPath] || metaImages[autoImgPath]) as
    | { default: string }
    | undefined;
  return metaImgModule?.default;
};

// Get all posts sorted by date (newest first)
export const getAllPosts = () => {
  return blogManifest
    .map((post, index) => ({
      ...post,
      frontmatter: {
        ...post.frontmatter,
        slug: slugs[index],
        metaImg: getMetaImgForSlug(slugs[index]),
      },
    }))
    .filter((post) => !post.frontmatter.draft)
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

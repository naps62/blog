// Import all MDX posts

import * as easilyMerging from "../posts/2014-11-easily-merging-pull-requests/index.mdx";
import * as perfectingCss from "../posts/2015-07-perfecting-a-css-3d-animation/index.mdx";
import * as smarterHeredoc from "../posts/2016-06-smarter-heredoc-syntax-in-vim/index.mdx";
import * as superPoweredVim1 from "../posts/2017-04-super-powered-vim-i-projections/index.mdx";
import * as superPoweredVim2 from "../posts/2017-04-super-powered-vim-ii-snippets/index.mdx";
import * as superPoweredVim3 from "../posts/2017-04-super-powered-vim-iii-skeletons/index.mdx";
import * as tutorialDeploying from "../posts/2017-05-tutorial-deploying-elixir-applications/index.mdx";
import * as understandingGenstage from "../posts/2018-11-understanding-elixirs-genstage/index.mdx";
import * as flagsSeeds from "../posts/2019-02-flags-seeds-and-idempotency-elixir/index.mdx";
import * as metaprogramming from "../posts/2019-02-metaprogramming-from-c-to-elixir/index.mdx";
import * as pouringProtocols from "../posts/2019-02-pouring-protocols-in-elixir/index.mdx";
import * as routingPhoenix from "../posts/2019-04-routing-in-phoenix-umbrella-apps/index.mdx";
import * as typespecs from "../posts/2019-10-typespecs-and-behaviours-in-elixir/index.mdx";
import * as continuousStuff from "../posts/2020-03-continuous-stuff-with-github-actions/index.mdx";
import * as knowledgeBase from "../posts/2020-07-knowledge-base/index.mdx";
import * as ethereumNode from "../posts/2023-11-ethereum-node-setup-reth-systemd/index.mdx";
import * as unityMeetsRust from "../posts/2025-07-unity-meets-rust/index.mdx";
import * as howIBuildFullstackEthereumApps from "../posts/2025-08-how-i-build-fullstack-ethereum-apps/index.mdx";

const postEntries = [
  {
    slug: "continuous-stuff-with-github-actions",
    dir: "2020-03-continuous-stuff-with-github-actions",
    module: continuousStuff,
  },
  {
    slug: "easily-merging-pull-requests",
    dir: "2014-11-easily-merging-pull-requests",
    module: easilyMerging,
  },
  {
    slug: "ethereum-node-setup-reth-systemd",
    dir: "2023-11-ethereum-node-setup-reth-systemd",
    module: ethereumNode,
  },
  {
    slug: "flags-seeds-and-idempotency-elixir",
    dir: "2019-02-flags-seeds-and-idempotency-elixir",
    module: flagsSeeds,
  },
  {
    slug: "knowledge-base",
    dir: "2020-07-knowledge-base",
    module: knowledgeBase,
  },
  {
    slug: "metaprogramming-from-c-to-elixir",
    dir: "2019-02-metaprogramming-from-c-to-elixir",
    module: metaprogramming,
  },
  {
    slug: "perfecting-a-css-3d-animation",
    dir: "2015-07-perfecting-a-css-3d-animation",
    module: perfectingCss,
  },
  {
    slug: "pouring-protocols-in-elixir",
    dir: "2019-02-pouring-protocols-in-elixir",
    module: pouringProtocols,
  },
  {
    slug: "routing-in-phoenix-umbrella-apps",
    dir: "2019-04-routing-in-phoenix-umbrella-apps",
    module: routingPhoenix,
  },
  {
    slug: "smarter-heredoc-syntax-in-vim",
    dir: "2016-06-smarter-heredoc-syntax-in-vim",
    module: smarterHeredoc,
  },
  {
    slug: "super-powered-vim-i-projections",
    dir: "2017-04-super-powered-vim-i-projections",
    module: superPoweredVim1,
  },
  {
    slug: "super-powered-vim-ii-snippets",
    dir: "2017-04-super-powered-vim-ii-snippets",
    module: superPoweredVim2,
  },
  {
    slug: "super-powered-vim-iii-skeletons",
    dir: "2017-04-super-powered-vim-iii-skeletons",
    module: superPoweredVim3,
  },
  {
    slug: "tutorial-deploying-elixir-applications",
    dir: "2017-05-tutorial-deploying-elixir-applications",
    module: tutorialDeploying,
  },
  {
    slug: "typespecs-and-behaviours-in-elixir",
    dir: "2019-10-typespecs-and-behaviours-in-elixir",
    module: typespecs,
  },
  {
    slug: "understanding-elixirs-genstage",
    dir: "2018-11-understanding-elixirs-genstage",
    module: understandingGenstage,
  },
  {
    slug: "unity-meets-rust",
    dir: "2025-07-unity-meets-rust",
    module: unityMeetsRust,
  },
  {
    slug: "how-i-build-fullstack-ethereum-apps",
    dir: "2025-08-how-i-build-fullstack-ethereum-apps",
    module: howIBuildFullstackEthereumApps,
  },
] as const;

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
  return postEntries
    .map(({ module, slug }) => ({
      ...module,
      frontmatter: {
        ...module.frontmatter,
        slug,
        metaImg: getMetaImgForSlug(slug),
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

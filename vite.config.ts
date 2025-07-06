import mdx from "@mdx-js/rollup";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeAddClasses from "rehype-class-names";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeMdxImportMedia from "rehype-mdx-import-media";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const classes = {
  "h1>a, h2>a, h3>a": "no-underline font-bold",
};

export default defineConfig({
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
        [rehypeAddClasses, classes],
        [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }],
        [
          rehypePrettyCode,
          {
            theme: "github-dark",
            keepBackground: false,
          },
        ],
        rehypeMdxImportMedia,
      ],
    }),
    tanstackStart({
      target: "vercel",
    }),
  ],
  optimizeDeps: {
    include: ["@mdx-js/react"],
  },
  preview: {
    port: 3000,
  },
});

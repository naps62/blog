import fs from "fs";
import { globSync } from "glob";
import matter from "gray-matter";
import path from "path";

export interface Post {
  directory: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  draft: boolean;
  authors: string[];
  canonicalUrl?: string;
  banner?: string;
  content: string;
}

export function getAllPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const fileNames = globSync("*/index.mdx", { cwd: postsDirectory });

  const posts = fileNames.map((fileName) => {
    const directory = fileName.replace(/\/index\.mdx$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const slug = data.slug || directory.replace(/^\d{4}-\d{2}-/, "");

    return {
      directory,
      slug,
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      draft: data.draft || false,
      authors: data.authors || [],
      canonicalUrl: data.canonicalUrl,
      banner: data.banner,
      content,
    };
  });

  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

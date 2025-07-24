import { Link } from "@tanstack/react-router";
import type { Post } from "../utils/manifest";
import { PostMeta } from "./PostMeta";

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-0">
      {posts.map((post) => {
        const frontmatter = post.frontmatter;
        const slug = frontmatter.slug;

        return (
          <article key={slug} className="pb-0">
            <h2 className="text-xl font-bold mb-1 leading-tight">
              <Link
                to="/posts/$slug"
                params={{ slug }}
                className="text-text-primary hover:text-link-primary no-underline transition-colors"
              >
                {frontmatter.title}
              </Link>
            </h2>
            <PostMeta date={frontmatter.date} tags={frontmatter.tags} />
          </article>
        );
      })}
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import type { Post } from "../utils/manifest";

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
            <h2 className="text-2xl font-bold mb-3 leading-tight">
              <Link
                to="/posts/$slug"
                params={{ slug }}
                className="text-text-primary hover:text-link-primary no-underline transition-colors"
              >
                {frontmatter.title}
              </Link>
            </h2>
            <div className="text-nav-text mb-4 flex items-center gap-4 text-sm">
              {frontmatter.date && (
                <time dateTime={frontmatter.date}>
                  {new Date(frontmatter.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block bg-tag-bg text-tag-text px-2 py-1 rounded text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
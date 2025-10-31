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
        const slug = post.slug;

        return (
          <article key={slug} className="pb-0">
            <h2 className="mb-1 font-bold text-xl leading-tight">
              <Link
                to="/posts/$slug"
                params={{ slug }}
                className="text-text-primary no-underline transition-colors hover:text-link-primary"
              >
                {frontmatter.draft && (
                  <span className="mr-2 font-normal text-sm text-yellow-700 dark:text-yellow-500">
                    [DRAFT]
                  </span>
                )}
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

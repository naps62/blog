import { createFileRoute, Link } from "@tanstack/react-router";
import { getAllPosts } from "../../utils/manifest";

export const Route = createFileRoute("/posts/")({
  component: () => {
    const posts = getAllPosts();

    return (
      <div className="prose prose-xl max-w-none">
        <div className="space-y-4">
          {posts.map((post) => {
            const frontmatter = post.frontmatter;
            const slug = frontmatter.slug;

            return (
              <article
                key={slug}
                className="border-b border-border-light pb-4 last:border-b-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
              >
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-0 leading-tight">
                    <Link
                      to="/posts/$slug"
                      params={{ slug }}
                      className="text-text-primary hover:text-link-primary no-underline transition-colors"
                    >
                      {frontmatter.title}
                    </Link>
                  </h2>
                  {frontmatter.canonicalUrl && (
                    <p className="text-sm text-text-muted mb-4">
                      Originally published at{" "}
                      <a
                        href={frontmatter.canonicalUrl}
                        className="text-link-primary hover:underline"
                      >
                        {new URL(frontmatter.canonicalUrl).hostname}
                      </a>
                    </p>
                  )}
                </div>
                <div className="text-nav-text flex items-center gap-4 text-sm sm:justify-end sm:flex-shrink-0">
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
      </div>
    );
  },
});

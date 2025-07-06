import { createFileRoute, Link } from "@tanstack/react-router";
import { getAllPosts } from "../utils/manifest";

export const Route = createFileRoute("/")({
  component: () => {
    const posts = getAllPosts().slice(0, 5);

    return (
      <div className="prose prose-xl max-w-none">
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8">Recent Posts</h2>
          <ul className="space-y-6 list-none pl-0">
            {posts.map((post) => {
              const frontmatter = post.frontmatter;
              const slug = frontmatter.slug;

              return (
                <li
                  key={slug}
                  className="py-6 border-b border-border-light last:border-b-0"
                >
                  <h3 className="text-xl font-bold mb-2">
                    <Link
                      to="/posts/$slug"
                      params={{ slug }}
                      className="text-text-primary hover:text-link-primary no-underline transition-colors"
                    >
                      {frontmatter.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    {frontmatter.date && (
                      <time
                        dateTime={frontmatter.date}
                        className="text-text-muted font-medium"
                      >
                        {new Date(frontmatter.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </time>
                    )}
                    {frontmatter.tags && frontmatter.tags.length > 0 && (
                      <div className="flex gap-3">
                        {frontmatter.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-link-primary text-sm font-medium uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <Link
              to="/posts"
              className="text-link-primary hover:text-link-strong font-medium"
            >
              All Posts →
            </Link>
          </div>
        </div>
      </div>
    );
  },
});

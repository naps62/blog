import { createFileRoute } from "@tanstack/react-router";
import { Markdown } from "../../components/markdown";
import { getPostBySlugEnhanced } from "../../utils/manifest";

const { VERCEL_ENV, VERCEL_URL, VERCEL_BRANCH_URL } = import.meta.env;

console.log("VERCEL_ENV", VERCEL_ENV);
console.log("VERCEL_URL", VERCEL_URL);
console.log("VERCEL_BRANCH_URL", VERCEL_BRANCH_URL);
const BASE_URL = VERCEL_ENV === "production" ? VERCEL_URL : VERCEL_BRANCH_URL;

export const Route = createFileRoute("/posts/$slug")({
  head: ({ params }) => {
    const post = getPostBySlugEnhanced(params.slug);
    if (!post) return {};

    const { frontmatter } = post;
    const meta = [
      { name: "description", content: frontmatter.title },
      { property: "og:title", content: frontmatter.title },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];

    console.log(frontmatter, BASE_URL, VERCEL_ENV);
    if (frontmatter.banner) {
      const absoluteImageUrl = new URL(frontmatter.banner, BASE_URL).href;
      meta.push(
        { property: "og:image", content: absoluteImageUrl },
        { name: "twitter:image", content: absoluteImageUrl },
      );
    }

    if (frontmatter.canonicalUrl) {
      meta.push({ property: "og:url", content: frontmatter.canonicalUrl });
    }

    console.log("fin");
    return {
      meta,
      title: frontmatter.title,
    };
  },
  component: () => {
    const { slug } = Route.useParams();
    const post = getPostBySlugEnhanced(slug);

    if (!post) {
      return (
        <div className="prose prose-lg max-w-none">
          <h1>Post not found</h1>
          <p>The requested post could not be found.</p>
        </div>
      );
    }

    const frontmatter = post.frontmatter;
    const PostComponent = post.default;

    return (
      <article className="prose prose-xl max-w-none">
        <header className="mb-12 text-center">
          {frontmatter.banner && (
            <div className="mb-8">
              <img
                src={frontmatter.banner}
                alt={frontmatter.title}
                className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold mb-6 leading-tight text-text-primary">
            {frontmatter.title}
          </h1>
          <div className="text-nav-text mb-6 flex items-center justify-center gap-4 text-sm">
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
              <div className="flex flex-wrap gap-2 justify-center">
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
        </header>
        <Markdown className="mb-16">
          <PostComponent />
        </Markdown>
      </article>
    );
  },
});

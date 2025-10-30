import { createFileRoute } from "@tanstack/react-router";
import { Markdown } from "../../components/markdown";
import { getPostBySlugEnhanced } from "../../utils/manifest";

const { VITE_VERCEL_URL } = import.meta.env;

export const Route = createFileRoute("/posts/$slug")({
  head: ({ params }) => {
    const post = getPostBySlugEnhanced(params.slug);
    if (!post) return {};

    const { frontmatter } = post;
    const bannerPath = `posts/${params.slug}/banner.png`;
    const customBanner = frontmatter.banner;
    const metaImagePath = frontmatter.metaImg ?? customBanner ?? bannerPath;
    const metaImageUrl =
      metaImagePath && /^https?:\/\//i.test(metaImagePath)
        ? metaImagePath
        : metaImagePath && VITE_VERCEL_URL
          ? new URL(metaImagePath, `https://${VITE_VERCEL_URL}`).href
          : metaImagePath;
    const meta = [
      { name: "description", content: frontmatter.title },
      { property: "og:title", content: frontmatter.title },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: `${frontmatter.title} | Miguel Palhas | @naps62` },
    ];
    const links = [];

    if (metaImageUrl) {
      meta.push(
        { property: "og:image", content: metaImageUrl },
        { name: "twitter:image", content: metaImageUrl },
      );
      meta.push({ name: "twitter:image:alt", content: frontmatter.title });
    }

    if (frontmatter.canonicalUrl) {
      meta.push({ property: "og:url", content: frontmatter.canonicalUrl });
      links.push({ rel: "canonical", content: frontmatter.canonicalUrl });
    }

    return {
      meta,
      links,
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
    const customBanner = frontmatter.banner;

    return (
      <article className="prose prose-lg max-w-none">
        <header className="mb-12 text-center">
          {customBanner && (
            <div className="mb-8">
              <img
                src={customBanner}
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
                target="_blank"
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

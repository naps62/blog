import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "../components/ExternalLink";
import { PostList } from "../components/PostList";
import { getAllPosts } from "../utils/manifest";

export const Route = createFileRoute("/")({
  component: () => {
    const posts = getAllPosts().slice(0, 5);

    return (
      <div className="prose prose-lg max-w-none">
        <div className="mb-8 flex flex-col-reverse items-center gap-6 md:mb-16 md:flex-row md:gap-12">
          <div className="flex-1">
            <h1 className="mb-4 font-bold text-4xl text-text-primary">
              Hello! I'm Miguel
            </h1>
            <p className="mb-2 text-lg text-text-primary">
              A senior engineer who spends his time solving deep technical
              challenges in various corners of the web, as well as tinkering
              with both hardware and software side-projects.
            </p>
            <p className="text-lg text-text-primary">
              I'm currently Head of Research at{" "}
              <ExternalLink href="https://subvisual.com">
                Subvisual
              </ExternalLink>
              , a venture-studio based in Portugal.
            </p>
          </div>
          <img
            src="https://github.com/naps62.png"
            alt="Miguel Palhas"
            className="not-prose w-30 rounded-full border-4 border-border-light shadow-lg md:w-40"
          />
        </div>

        <div className="mt-8 md:mt-12">
          <h2 className="mb-6 font-bold text-2xl text-text-primary md:mb-8">
            Writing
          </h2>
          <PostList posts={posts} />

          <div className="mt-8">
            <Link
              to="/posts"
              className="font-medium text-link-primary hover:text-link-strong"
            >
              All Posts →
            </Link>
          </div>
        </div>
      </div>
    );
  },
});

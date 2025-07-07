import { createFileRoute, Link } from "@tanstack/react-router";
import { getAllPosts } from "../utils/manifest";
import { PostList } from "../components/PostList";

export const Route = createFileRoute("/")({
  component: () => {
    const posts = getAllPosts().slice(0, 5);

    return (
      <div className="prose prose-lg max-w-none">
        <div className="flex items-center gap-12 mb-16">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Hello! I'm Miguel
            </h1>
            <p className="text-lg text-text-primary mb-2">
              I'm a senior engineer who spends his time solving deep technical
              challenges in various corners of the web, as well as tinkering
              with both hardware and software side-projects.
            </p>
            <p className="text-lg text-text-primary">
              I'm currently Head of Research at{" "}
              <Link
                className="text-link-primary hover:text-link-strong font-medium"
                target="_blank"
                to="https://subvisual.com"
              >
                Subvisual
              </Link>
              , a venture-studio based in Portugal.
            </p>
          </div>
          <div className="flex-shrink-0">
            <img
              src="https://github.com/naps62.png"
              alt="Miguel Palhas"
              className="w-32 h-32 rounded-full border-4 border-border-light shadow-lg"
            />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8">Writing</h2>
          <PostList posts={posts} />

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

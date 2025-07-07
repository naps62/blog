import { createFileRoute, Link } from "@tanstack/react-router";
import { getAllPosts } from "../utils/manifest";
import { PostList } from "../components/PostList";

export const Route = createFileRoute("/")({
  component: () => {
    const posts = getAllPosts().slice(0, 5);

    return (
      <div className="prose prose-lg max-w-none">
        <div className="mt-12">
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

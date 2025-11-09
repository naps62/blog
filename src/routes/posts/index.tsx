import { createFileRoute } from "@tanstack/react-router";
import { Rss } from "lucide-react";
import { PostList } from "../../components/PostList";
import { posts } from "../../utils/manifest";

export const Route = createFileRoute("/posts/")({
  component: () => {
    return (
      <div className="prose prose-lg">
        <div className="flex items-center gap-3">
          <h1 className="text-text-primary">Posts</h1>
          <a
            href="/feed.xml"
            aria-label="RSS Feed"
            className="text-nav-text transition-colors hover:text-nav-hover"
          >
            <Rss className="h-5 w-5" />
          </a>
        </div>
        <PostList posts={posts} />
      </div>
    );
  },
});

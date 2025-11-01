import { createFileRoute } from "@tanstack/react-router";
import { PostList } from "../../components/PostList";
import { posts } from "../../utils/manifest";

export const Route = createFileRoute("/posts/")({
  component: () => {
    return (
      <div className="prose prose-lg">
        <h1 className="text-text-primary">Posts</h1>
        <PostList posts={posts} />
      </div>
    );
  },
});

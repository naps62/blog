import { createFileRoute } from "@tanstack/react-router";
import { PostList } from "../../components/PostList";
import { getAllPosts } from "../../utils/manifest";

export const Route = createFileRoute("/posts/")({
  component: () => {
    const posts = getAllPosts();

    return (
      <div className="prose prose-lg max-w-none">
        <h1 className="text-text-primary">Posts</h1>
        <PostList posts={posts} />
      </div>
    );
  },
});

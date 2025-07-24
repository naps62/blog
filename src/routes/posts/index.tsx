import { createFileRoute } from "@tanstack/react-router";
import { PostList } from "../../components/PostList";
import { getAllPosts } from "../../utils/manifest";

export const Route = createFileRoute("/posts/")({
  component: () => {
    const posts = getAllPosts();

    return (
      <div className="prose prose-lg max-w-none">
        <PostList posts={posts} />
      </div>
    );
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { getAllPosts } from "../../utils/manifest";
import { PostList } from "../../components/PostList";

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

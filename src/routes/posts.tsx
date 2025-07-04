import { createFileRoute } from '@tanstack/react-router'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts, allBlogs } from '@/src/lib/content'

const POSTS_PER_PAGE = 5

export const Route = createFileRoute('/posts')({
  component: () => {
    const posts = allCoreContent(sortPosts(allBlogs))
    const pageNumber = 1
    const initialDisplayPosts = posts.slice(
      POSTS_PER_PAGE * (pageNumber - 1),
      POSTS_PER_PAGE * pageNumber
    )
    const pagination = {
      currentPage: pageNumber,
      totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
    }

    return (
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    )
  },
})
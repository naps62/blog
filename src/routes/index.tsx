import { createFileRoute } from '@tanstack/react-router'
import { sortPosts, allCoreContent, allBlogs } from '@/src/lib/content'
import Main from '@/app/Main'

export const Route = createFileRoute('/')({
  component: () => {
    const sortedPosts = sortPosts(allBlogs)
    const posts = allCoreContent(sortedPosts)
    return <Main posts={posts} />
  },
})
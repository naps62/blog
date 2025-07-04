import { createFileRoute } from '@tanstack/react-router'
import { slug } from 'github-slugger'
import { allCoreContent, sortPosts, allBlogs, createTagCount } from '@/src/lib/content'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'

export const Route = createFileRoute('/tags/$tag')({
  component: ({ params }) => {
    const tag = decodeURI(params.tag)
    const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
    const filteredPosts = allCoreContent(
      sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
    )
    return <ListLayout posts={filteredPosts} title={title} />
  },
})
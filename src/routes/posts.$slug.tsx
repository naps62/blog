import { createFileRoute, notFound } from '@tanstack/react-router'
import 'css/prism.css'
import 'katex/dist/katex.css'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent, allBlogs, allAuthors, type BlogPost, type Author } from '@/src/lib/content'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export const Route = createFileRoute('/posts/$slug')({
  component: ({ params }) => {
    const slug = decodeURI(params.slug)
    const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
    const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
    
    if (postIndex === -1) {
      throw notFound()
    }

    const prev = sortedCoreContents[postIndex + 1]
    const next = sortedCoreContents[postIndex - 1]
    const post = allBlogs.find((p) => p.slug === slug) as BlogPost
    const authorList = post?.authors || ['default']
    const authorDetails = authorList.map((author) => {
      const authorResults = allAuthors.find((p) => p.slug === author)
      return coreContent(authorResults as Author)
    })
    const mainContent = coreContent(post)
    const jsonLd = post.structuredData
    jsonLd['author'] = authorDetails.map((author) => {
      return {
        '@type': 'Person',
        name: author.name,
      }
    })

    const Layout = layouts[post.layout || defaultLayout]

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
          <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
        </Layout>
      </>
    )
  },
})
import { readFileSync } from 'fs'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { slug } from 'github-slugger'

export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  summary?: string
  draft?: boolean
  authors?: string[]
  layout?: string
  canonicalUrl?: string
  images?: string[]
  lastmod?: string
  readingTime: any
  body: { raw: string }
  _raw: {
    flattenedPath: string
    sourceFilePath: string
  }
  structuredData: any
}

export interface Author {
  slug: string
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
  layout?: string
  body: { raw: string }
  _raw: {
    flattenedPath: string
    sourceFilePath: string
  }
}

const siteMetadata = {
  title: 'Blog',
  author: 'Your Name',
  headerTitle: 'Blog',
  description: 'A blog about coding and tech',
  language: 'en-us',
  theme: 'system',
  siteUrl: 'https://your-site.com',
  siteRepo: 'https://github.com/your-repo',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/twitter-card.png',
  email: 'your-email@example.com',
  github: 'https://github.com/your-username',
  twitter: 'https://twitter.com/your-username',
  linkedin: 'https://www.linkedin.com/in/your-username',
}

function processContent(filePath: string, type: 'posts' | 'authors'): BlogPost | Author {
  const source = readFileSync(filePath, 'utf8')
  const { data, content } = matter(source)
  
  const relativePath = path.relative(process.cwd(), filePath)
  const flattenedPath = relativePath.replace(/^data\//, '').replace(/\.mdx?$/, '')
  const slugValue = flattenedPath.replace(/^(posts|authors)\//, '')
  
  const baseContent = {
    slug: slugValue,
    body: { raw: content },
    _raw: {
      flattenedPath,
      sourceFilePath: relativePath,
    },
    ...data,
  }

  if (type === 'posts') {
    const post = baseContent as BlogPost
    post.readingTime = readingTime(content)
    post.structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.date,
      dateModified: post.lastmod || post.date,
      image: post.images ? post.images[0] : siteMetadata.socialBanner,
      url: `${siteMetadata.siteUrl}/posts/${post.slug}`,
    }
    return post
  }

  return baseContent as Author
}

export function getAllPosts(): BlogPost[] {
  const postFiles = glob.sync('data/posts/**/*.mdx')
  return postFiles
    .map(file => processContent(file, 'posts'))
    .filter(post => !post.draft || process.env.NODE_ENV !== 'production')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as BlogPost[]
}

export function getAllAuthors(): Author[] {
  const authorFiles = glob.sync('data/authors/**/*.mdx')
  return authorFiles.map(file => processContent(file, 'authors')) as Author[]
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(post => post.slug === slug)
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return getAllAuthors().find(author => author.slug === slug)
}

export function createTagCount() {
  const posts = getAllPosts()
  const tagCount: Record<string, number> = {}
  
  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => {
        const formattedTag = slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  
  return tagCount
}

// Export compatible objects for the existing codebase
export const allBlogs = getAllPosts()
export const allAuthors = getAllAuthors()

// Utility functions to match pliny
export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function allCoreContent(posts: BlogPost[]): BlogPost[] {
  return posts
}

export function coreContent(post: BlogPost | Author): BlogPost | Author {
  return post
}
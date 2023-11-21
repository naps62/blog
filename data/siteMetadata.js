/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Miguel Palhas | @naps62',
  author: 'Miguel Palhas',
  headerTitle: 'Miguel Palhas | @naps62',
  description: 'Software | Rust | Blockchain | Web',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://naps62.com',
  siteRepo: 'https://github.com/naps62/naps62.github.io',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/twitter-card.png',
  mastodon: 'https://mastodon.social/@naps62',
  email: 'mpalhas@gmail.com',
  github: 'https://github.com/naps62',
  twitter: 'https://twitter.com/naps62',
  youtube: null,
  linkedin: null,
  locale: 'en-US',
  analytics: {
    googleAnalytics: {
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
    },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus
    // Please add your .env file and modify it according to your selection
    provider: 'buttondown',
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: 'search.json', // path to load documents to search
    },
  },
}

module.exports = siteMetadata

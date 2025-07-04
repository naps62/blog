import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from '@/app/theme-providers'

export const Route = createRootRoute({
  component: () => (
    <ThemeProviders>
      <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
      <SectionContainer>
        <div className="flex h-screen flex-col justify-between font-sans">
          <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
            <Header />
            <main className="mb-auto">
              <Outlet />
            </main>
          </SearchProvider>
          <Footer />
        </div>
      </SectionContainer>
      <VercelAnalytics />
      <TanStackRouterDevtools />
    </ThemeProviders>
  ),
})
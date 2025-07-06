import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactNode } from "react";
import appCss from "../app.css?url";

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Software | Rust | Blockchain | Web" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="stylesheet" href={appCss} />
        <title>Miguel Palhas | @naps62</title>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen bg-bg-secondary">
          <header className="bg-bg-primary border-b border-border-primary  top-0 z-10">
            <div className="max-w-4xl mx-auto px-6 py-4">
              <nav className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                  <Link
                    to="/"
                    className="text-nav-title hover:text-nav-title-hover"
                  >
                    Miguel Palhas | @naps62
                  </Link>
                </h1>
                <div className="flex space-x-4 text-base">
                  <Link
                    to="/"
                    className="text-nav-text hover:text-nav-hover transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    to="/posts"
                    className="text-nav-text hover:text-nav-hover transition-colors"
                  >
                    Posts
                  </Link>
                  <Link
                    to="/talks"
                    className="text-nav-text hover:text-nav-hover transition-colors"
                  >
                    Talks
                  </Link>
                </div>
              </nav>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-6 py-12">{children}</main>
        </div>
        <TanStackRouterDevtools />
      </body>
    </html>
  );
}

export const Route = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
});

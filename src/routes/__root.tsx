import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactNode } from "react";
import appCss from "@/app.css?url";
import { seo } from "@/utils/seo";
import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary";
import { NotFound } from "../components/NotFound";

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen bg-bg-secondary">
          <header className="bg-bg-primary border-b border-border-primary  top-0 z-10">
            <div className="max-w-4xl mx-auto px-6 py-4">
              <nav className="flex items-center justify-between">
                <h1 className="text-xl font-bold">
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
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Miguel Palhas | @naps62",
        description: "Software | Rust | Blockchain | Web",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-BGZRW8TCGD",
        async: true,
      },
      {
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BGZRW8TCGD');
        `,
      },
    ],
  }),

  errorComponent: (props) => {
    return (
      <RootLayout>
        <DefaultCatchBoundary {...props} />
      </RootLayout>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
});

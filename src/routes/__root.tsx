import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactNode } from "react";
import appCss from "@/app.css?url";
import { seo } from "@/utils/seo";
import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { NotFound } from "../components/NotFound";

const queryClient = new QueryClient();

interface RootLayoutProps {
  children: ReactNode;
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
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-BGZRW8TCGD",
        async: true,
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

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="bg-bg-primary">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const stored = localStorage.getItem('theme');
                if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BGZRW8TCGD');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-bg-secondary">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <main className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-12">
            {children}
          </main>
          <Footer />
          <TanStackRouterDevtools />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

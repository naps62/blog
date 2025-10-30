import { MDXProvider } from "@mdx-js/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import { Check, Copy, Link as LinkIcon, LoaderCircle } from "lucide-react";
import { HTMLAttributes, ReactNode, Suspense, useRef, useState } from "react";
import { cn } from "@/utils";
import { getOpengraphEmbedData } from "../server/embed";
import { ExternalLink } from "./ExternalLink";

interface MarkdownProps {
  children: ReactNode;
  className?: string;
}

const components = {
  Embed: SuspendedEmbed,
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-3xl font-bold mb-6 mt-16 first:mt-0 text-text-primary"
      {...props}
    />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-2xl font-bold mb-5 mt-14 text-text-primary"
      {...props}
    />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-bold mb-4 mt-12 text-text-primary" {...props} />
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-lg font-bold mb-3 mt-10 text-text-primary" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-6 leading-relaxed text-text-secondary" {...props} />
  ),
  a: (props: HTMLAttributes<HTMLAnchorElement> & { href?: string }) => {
    // Handle heading anchor links differently
    if (props.href?.startsWith("#")) {
      return <a {...props} className="text-text-primary no-underline" />;
    }

    return (
      <ExternalLink href={props.href || ""} showUnderline {...props}>
        {props.children}
      </ExternalLink>
    );
  },
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-inside mb-6 space-y-2 text-text-secondary"
      {...props}
    />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-inside mb-6 space-y-2 text-text-secondary"
      {...props}
    />
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-border-accent pl-6 italic mb-6 text-nav-text bg-bg-accent py-4 rounded-r-lg"
      {...props}
    />
  ),
  table: (props: HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-6">
      <table
        className="min-w-full border border-border-secondary rounded-lg border-collapse"
        {...props}
      />
    </div>
  ),
  th: (props: HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-border-secondary px-4 py-3 bg-bg-secondary font-bold text-left text-text-primary"
      {...props}
    />
  ),
  td: (props: HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border border-border-secondary px-4 py-3 text-text-secondary"
      {...props}
    />
  ),
  img: (props: HTMLAttributes<HTMLImageElement>) => (
    <>
      <img className="max-w-full h-auto rounded-lg mb-6 shadow-sm" {...props} />
    </>
  ),
  Video: (props: HTMLAttributes<HTMLVideoElement>) => (
    <picture className="flex w-full justify-center">
      <video className="w-full max-w-[600px]" {...props} />
    </picture>
  ),
  Figure: ({
    src,
    alt,
    caption,
    ...props
  }: {
    src: string;
    alt?: string;
    caption?: string;
  } & HTMLAttributes<HTMLElement>) => (
    <figure className="mb-6" {...props}>
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg shadow-sm m-auto"
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-text-secondary text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  ),
  figure: ({ ...props }) => {
    if (props["data-rehype-pretty-code-figure"] !== undefined) {
      return <CodeBlock {...props} />;
    }

    return <figure {...props} />;
  },
  hr: (props: HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-12 border-border-secondary" {...props} />
  ),
  em: (props: HTMLAttributes<HTMLElement>) => (
    <em className="italic text-nav-text" {...props} />
  ),
  strong: (props: HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-text-primary" {...props} />
  ),
};

export function Markdown({ children, className, ...props }: MarkdownProps) {
  return (
    <div
      className={clsx("prose dark:prose-invert prose-lg max-w-none", className)}
      {...props}
    >
      <MDXProvider components={components}>{children}</MDXProvider>
    </div>
  );
}

function SuspendedEmbed({ url }: { url: string }) {
  return (
    <a
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      className="not-prose md:mx-20 my-8 block overflow-hidden rounded-xl border border-border-secondary bg-bg-primary no-underline hover:bg-bg-secondary transition-colors"
    >
      <Suspense
        fallback={
          <div className="flex h-32 w-full items-center justify-center gap-2 border">
            <LoaderCircle className="animate-spin" />
            <span className="text-text-secondary">{url}</span>
          </div>
        }
      >
        <Embed url={url} />
      </Suspense>
    </a>
  );
}

function Embed({ url: urlStr }: { url: string }) {
  const {
    data: { image, title, description, url },
  } = useSuspenseQuery({
    queryKey: ["embed", urlStr],
    queryFn: () => getOpengraphEmbedData({ data: { url: urlStr } }),
  });

  return (
    <div className="flex flex-col items-stretch md:flex-row-reverse">
      <div className="aspect-video shrink-0 md:w-64">
        <img
          src={image}
          className="mt-0 mb-0 h-full w-full object-cover"
          alt={title}
        />
      </div>
      <div className="hidden grow flex-col items-stretch justify-between gap-2 overflow-hidden p-4 md:flex">
        <h3 className="font-bold text-base text-text-primary line-clamp-2">
          {title}
        </h3>
        <p className="line-clamp-3 font-light text-sm text-text-secondary">
          {description}
        </p>
        <p className="flex items-center gap-2 text-text-secondary">
          <LinkIcon size="14" />
          {url.host}
        </p>
      </div>
    </div>
  );
}

function CodeBlock({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  const [copied, setCopied] = useState(false);
  const figRef = useRef<HTMLPreElement>(null);

  const onClick = () => {
    const code = figRef.current?.getElementsByTagName("code")[0]?.textContent;
    navigator.clipboard.writeText(code || "");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const Icon = copied ? Check : Copy;

  return (
    <figure ref={figRef} className={cn(className, "group relative")} {...props}>
      <button
        onClick={onClick}
        className="absolute transition-opacity cursor-pointer opacity-0 group-hover:opacity-100 top-0 right-0 p-2 text-text-secondary"
      >
        <Icon size="20" className="stroke-text-subtle" />
      </button>
      {children}
    </figure>
  );
}

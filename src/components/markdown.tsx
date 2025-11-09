import { MDXProvider } from "@mdx-js/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Info,
  Link as LinkIcon,
  LoaderCircle,
} from "lucide-react";
import {
  ComponentType,
  HTMLAttributes,
  ReactNode,
  Suspense,
  useRef,
  useState,
} from "react";
import { cn } from "@/utils";
import { getOpengraphEmbedData } from "../server/embed";
import { ExternalLink } from "./ExternalLink";

interface MarkdownProps {
  children: ReactNode;
  className?: string;
}

const components = {
  Embed: SuspendedEmbed,
  Notice,
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="mt-16 mb-6 font-bold text-3xl text-text-primary first:mt-0"
      {...props}
    />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-14 mb-5 font-bold text-2xl text-text-primary"
      {...props}
    />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-12 mb-4 font-bold text-text-primary text-xl" {...props} />
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-10 mb-3 font-bold text-lg text-text-primary" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-6 text-text-secondary leading-relaxed" {...props} />
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
    <ul className="text-secondary" {...props} />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol className="text-secondary" {...props} />
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => (
    <li className="!m-1 leading-relaxed" {...props} />
  ),
  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mb-6 rounded-r-lg border-border-accent border-l-4 bg-bg-accent py-4 pl-6 text-nav-text italic"
      {...props}
    />
  ),
  table: (props: HTMLAttributes<HTMLTableElement>) => (
    <div className="mb-6 overflow-x-auto">
      <table
        className="min-w-full border-collapse rounded-lg border border-border-secondary"
        {...props}
      />
    </div>
  ),
  th: (props: HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-border-secondary bg-bg-secondary px-4 py-3 text-left font-bold text-text-primary"
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
      <img className="mb-6 h-auto max-w-full rounded-lg shadow-sm" {...props} />
    </>
  ),
  Video: (props: HTMLAttributes<HTMLVideoElement>) => (
    <picture className="flex w-full justify-center">
      <video className="w-full max-w-[600px]" {...props} />
    </picture>
  ),
  Youtube: ({ videoId }: { videoId: string }) => (
    <div className="my-6 flex w-full justify-center">
      <iframe
        className="aspect-video w-full max-w-[800px] rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  ),
  Figure: ({
    src,
    alt,
    caption,
    imgClassName = "",
    ...props
  }: {
    src: string;
    alt?: string;
    caption?: string;
    imgClassName?: string;
  } & HTMLAttributes<HTMLElement>) => (
    <figure className="mb-6" {...props}>
      <img
        src={src}
        alt={alt}
        className={cn("m-auto max-w-full rounded-lg shadow-sm", imgClassName)}
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-text-secondary italic">
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
    <hr className="!my-8 border-border-secondary" {...props} />
  ),
  em: (props: HTMLAttributes<HTMLElement>) => (
    <em className="text-nav-text italic" {...props} />
  ),
  strong: (props: HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-text-primary" {...props} />
  ),
};

type NoticeVariant = "info" | "success" | "error";

interface NoticeProps {
  type?: NoticeVariant;
  title?: string;
  children: ReactNode;
}

type NoticeVariantConfig = {
  Icon: ComponentType<{ className?: string }>;
  className: string;
  iconClassName: string;
};

const NOTICE_VARIANTS: Record<NoticeVariant, NoticeVariantConfig> = {
  info: {
    Icon: Info,
    className: "border-notice-info bg-notice-info/10",
    iconClassName: "text-[var(--color-notice-info)]",
  },
  success: {
    Icon: CheckCircle2,
    className: "border-notice-success bg-notice-success/10",
    iconClassName: "text-[var(--color-notice-success)]",
  },
  error: {
    Icon: AlertCircle,
    className: "border-notice-error bg-notice-error/10",
    iconClassName: "text-[var(--color-notice-error)]",
  },
};

function Notice({ type = "info", title, children }: NoticeProps) {
  const variant = NOTICE_VARIANTS[type];

  return (
    <section
      className={cn(
        "not-prose m-auto my-4 flex gap-2 rounded-xl border px-4 py-2 text-text-primary shadow-sm transition-colors",
        variant.className,
      )}
      role="note"
      aria-label={title ?? `${type} notice`}
    >
      <variant.Icon
        aria-hidden="true"
        className={cn("mt-2 h-4 w-4 shrink-0", variant.iconClassName)}
      />
      <div className="w-full">
        {title && <p className="font-semibold">{title}</p>}
        <div className="prose prose-sm max-w-full text-current">{children}</div>
      </div>
    </section>
  );
}

export function Markdown({ children, className, ...props }: MarkdownProps) {
  return (
    <div
      className={clsx("prose dark:prose-invert prose-lg", className)}
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
      className="not-prose my-8 block overflow-hidden rounded-xl border border-border-secondary bg-bg-primary no-underline transition-colors hover:bg-bg-secondary"
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
        <h3 className="line-clamp-2 font-bold text-base text-text-primary">
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
        className="absolute top-0 right-0 cursor-pointer p-2 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Icon size="20" className="stroke-text-subtle" />
      </button>
      {children}
    </figure>
  );
}

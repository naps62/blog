import { MDXProvider } from "@mdx-js/react";
import { clsx } from "clsx";
import { HTMLAttributes, ReactNode } from "react";

interface MarkdownProps {
  children: ReactNode;
  className?: string;
}

const components = {
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-3xl font-bold mb-6 mt-12 first:mt-0 text-text-primary"
      {...props}
    />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-2xl font-bold mb-5 mt-10 text-text-primary"
      {...props}
    />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-bold mb-4 mt-8 text-text-primary" {...props} />
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-lg font-bold mb-3 mt-6 text-text-primary" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-6 leading-relaxed text-text-secondary" {...props} />
  ),
  a: (props: HTMLAttributes<HTMLAnchorElement> & { href?: string }) => (
    <a
      className="text-link-primary hover:text-link-strong underline font-medium transition-colors"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
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
        className="min-w-full border border-border-secondary rounded-lg"
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
    <img className="max-w-full h-auto rounded-lg mb-6 shadow-sm" {...props} />
  ),
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
    <div className={clsx("prose prose-lg max-w-none", className)} {...props}>
      <MDXProvider components={components}>{children}</MDXProvider>
    </div>
  );
}

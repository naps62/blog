import { clsx } from "clsx";
import { ReactNode } from "react";

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  showUnderline?: boolean;
}

export function ExternalLink({
  href,
  children,
  className,
  showUnderline = false,
}: ExternalLinkProps) {
  const isExternal = href.startsWith("http");
  const baseClasses =
    "text-link-primary hover:text-link-strong font-medium transition-colors";
  const underlineClass = showUnderline ? "underline" : "";

  return (
    <a
      href={href}
      className={clsx(baseClasses, underlineClass, className)}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

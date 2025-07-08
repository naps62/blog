import { clsx } from "clsx";
import { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={clsx(
        "inline-block bg-tag-bg text-tag-text px-2 py-1 rounded text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

interface TagListProps {
  tags: string[];
  className?: string;
}

export function TagList({ tags, className }: TagListProps) {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className={clsx("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </div>
  );
}
import { clsx } from "clsx";
import { FormattedDate } from "./FormattedDate";
import { TagList } from "./Tag";

interface PostMetaProps {
  date?: string;
  tags?: string[];
  className?: string;
  justify?: "start" | "center";
}

export function PostMeta({ 
  date, 
  tags, 
  className, 
  justify = "start" 
}: PostMetaProps) {
  const justifyClass = justify === "center" ? "justify-center" : "";
  
  return (
    <div className={clsx("text-nav-text mb-2 flex items-center gap-4 text-sm", justifyClass, className)}>
      {date && <FormattedDate date={date} />}
      {tags && tags.length > 0 && (
        <TagList tags={tags} className={justify === "center" ? "justify-center" : ""} />
      )}
    </div>
  );
}
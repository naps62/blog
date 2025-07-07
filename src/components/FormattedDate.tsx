interface FormattedDateProps {
  date: string;
  className?: string;
}

export function FormattedDate({ date, className }: FormattedDateProps) {
  return (
    <time dateTime={date} className={className}>
      {new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </time>
  );
}
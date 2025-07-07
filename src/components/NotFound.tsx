import { Link } from "@tanstack/react-router";

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="space-y-2 p-2">
      <div className="text-nav-text dark:text-text-muted-dark">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <p className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded bg-success px-2 py-1 font-black text-sm text-white uppercase"
        >
          Go back
        </button>
        <Link
          to="/"
          className="rounded bg-info px-2 py-1 font-black text-sm text-white uppercase"
        >
          Start Over
        </Link>
      </p>
    </div>
  );
}

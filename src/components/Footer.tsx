import { Github, Mail, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bottom-0 z-10 bg-bg-primary">
      <div className="mx-auto max-w-4xl px-6 py-4">
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://github.com/naps62"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-nav-text transition-colors hover:text-nav-hover"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://twitter.com/naps62"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-nav-text transition-colors hover:text-nav-hover"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="mailto:mpalhas@gmail.com"
            aria-label="Email"
            className="text-nav-text transition-colors hover:text-nav-hover"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

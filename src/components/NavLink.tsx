import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import { ReactNode } from "react";

interface NavLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function NavLink({ to, children, className }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={clsx("text-nav-text hover:text-nav-hover transition-colors", className)}
    >
      {children}
    </Link>
  );
}
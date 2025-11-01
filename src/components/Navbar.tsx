import { Link } from "@tanstack/react-router";
import { DarkModeToggle } from "./DarkModeToggle";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";

export function Navbar() {
  return (
    <header className="relative top-0 z-10 bg-bg-primary">
      <div className="mx-auto max-w-4xl px-6 py-4 min-h-16">
        <nav className="flex items-center justify-between">
          <h1 className="font-bold text-lg md:text-xl">
            <Link
              to="/"
              className="text-nav-title hover:text-nav-title-hover"
            >
              Miguel Palhas | @naps62
            </Link>
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-6 md:flex">
              <div className="flex space-x-4 text-base">
                <NavLink to="/posts">Posts</NavLink>
                <NavLink to="/talks">Talks</NavLink>
              </div>
              <DarkModeToggle />
            </div>
            <div className="flex items-center gap-4 md:hidden">
              <DarkModeToggle />
              <MobileMenu />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

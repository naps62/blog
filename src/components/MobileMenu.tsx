import { useState } from "react";
import { NavLink } from "./NavLink";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="flex cursor-pointer flex-col items-center justify-center gap-1.5 p-2 text-nav-text hover:text-nav-hover"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span
          className={`h-0.5 w-6 bg-current transition-all duration-300 ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-current transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-current transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 left-0 border-border-primary border-b bg-bg-primary shadow-lg">
          <nav className="flex flex-col space-y-4 px-6 py-4">
            <div onClick={() => setIsOpen(false)}>
              <NavLink to="/posts" className="text-lg">
                Posts
              </NavLink>
            </div>
            <div onClick={() => setIsOpen(false)}>
              <NavLink to="/talks" className="text-lg">
                Talks
              </NavLink>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

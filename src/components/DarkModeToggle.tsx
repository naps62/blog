import { ClientOnly } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const isDark = document.documentElement.classList.contains("dark");
  return isDark ? "dark" : "light";
}

function ThemeToggleButton() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 transition-colors hover:bg-bg-muted"
      aria-label="Toggle dark mode"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-nav-text" />
      ) : (
        <Sun className="h-5 w-5 text-nav-text" />
      )}
    </button>
  );
}

export function DarkModeToggle() {
  return (
    <ClientOnly fallback={<div className="h-9 w-9" aria-hidden="true" />}>
      <ThemeToggleButton />
    </ClientOnly>
  );
}

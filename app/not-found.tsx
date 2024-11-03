// app/not-found.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const darkModePreference =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDarkMode(darkModePreference);
    setMounted(true);

    if (darkModePreference) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-800 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>

        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="bg-slate-700 rounded-lg shadow-xl p-8 border border-slate-600 text-center">
            <h1 className="text-6xl font-bold text-cyan-400 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-300 mb-6">
              Oops! The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/"
              className="inline-block bg-cyan-600 text-gray-100 py-2 px-6 rounded-lg hover:bg-cyan-500 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

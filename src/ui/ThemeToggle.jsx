import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Run once on mount → load from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    const shouldBeDark = savedTheme ? savedTheme === 'true' : prefersDark;
    setIsDark(shouldBeDark);

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); // ✅ only once

  // Run whenever isDark changes → persist to localStorage + update DOM
  useEffect(() => {
    localStorage.setItem('darkMode', isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]); // ✅ controlled updates

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

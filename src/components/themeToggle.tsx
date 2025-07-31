
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Icon icon={theme === "dark" ? "line-md:moon-filled-to-sunny-filled-loop-transition" : "line-md:sunny-filled-loop-to-moon-filled-transition"} className="text-xl" />
    </button>
  );
};

export default ThemeToggle;

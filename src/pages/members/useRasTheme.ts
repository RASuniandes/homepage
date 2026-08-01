import { useState, useEffect } from "react";

// Reads ras-theme dynamically from localStorage
export function useRasTheme() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("ras-theme") === "dark");

  useEffect(() => {
    const handleStorageChange = () => {
      setIsDark(localStorage.getItem("ras-theme") === "dark");
    };

    // Watch for theme changes dispatched locally or across tabs
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return isDark;
}

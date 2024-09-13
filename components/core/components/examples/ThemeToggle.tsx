import React, { useEffect, useState } from "react";
import { getCookie, setCookie } from "typescript-cookie";
const ThemeToggle = () => {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    const body = document.querySelector("body");
    if (theme === "light") {
      body?.classList.remove("dark");
      body?.classList.add("light");
    } else {
      body?.classList.remove("light");
      body?.classList.add("dark");
    }
  }, [theme]);

  useEffect(() => {
    const theme = getCookie("avl4_theme") || "light"; // avl4webbez_theme
    setTheme(theme);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setCookie("avl4_theme", newTheme, {
      domain: "sc.avl.team",
      expires: 364,
    });
  };

  return (
    <div>
      <div className="theme-toggle-circle">
        <button
          className="theme-toggle_light "
          onClick={() => {
            handleThemeToggle();
          }}
        ></button>
        <button
          className="theme-toggle_dark"
          onClick={() => {
            handleThemeToggle();
          }}
        ></button>
      </div>
    </div>
  );
};

export default ThemeToggle;

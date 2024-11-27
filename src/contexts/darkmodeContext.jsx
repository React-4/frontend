/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

export const darkmodeContext = createContext();

function localStorageChecker() {
  if (!localStorage.theme) return false;
  return localStorage.theme === "dark" ? true : false;
}
export function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(localStorageChecker());
  const handleDarkMode = () => {
    setDark((state) => {
      const update = !state;
      if (update) {
        localStorage.theme = "dark";
      } else {
        localStorage.theme = "light";
      }
      return update;
    });
  };

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <>
      <darkmodeContext.Provider value={{ handleDarkMode, dark }}>
        {children}
      </darkmodeContext.Provider>
    </>
  );
}

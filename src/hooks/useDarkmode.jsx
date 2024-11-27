import { useContext } from "react";
import { darkmodeContext } from "../contexts/darkmodeContext";

export function useDarkmode() {
  const { handleDarkMode, dark } = useContext(darkmodeContext);

  return { handleDarkMode, dark };
}

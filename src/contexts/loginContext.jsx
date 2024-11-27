/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const loginContext = createContext();

function checkLocal() {
  const local_login = localStorage.getItem("login-token");
  return local_login !== "" ? local_login : null;
}
function checkLocalProflie() {
  return localStorage.getItem("profileColor") || "";
}
export function LoginProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(checkLocal());
  const [profileColor, setProfileColor] = useState(checkLocalProflie());

  return (
    <>
      <loginContext.Provider
        value={{ loggedIn, setLoggedIn, profileColor, setProfileColor }}
      >
        {children}
      </loginContext.Provider>
    </>
  );
}

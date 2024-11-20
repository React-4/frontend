/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const loginContext = createContext();

function checkLocal() {
  const local_login = localStorage.getItem("login-token");
  return local_login !== "" ? local_login : null;
}
export function LoginProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(checkLocal());

  return (
    <>
      <loginContext.Provider value={{ loggedIn, setLoggedIn }}>
        {children}
      </loginContext.Provider>
    </>
  );
}

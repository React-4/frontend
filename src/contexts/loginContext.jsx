/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const loginContext = createContext();

function checkLocal() {
  const local_login = localStorage.getItem("isLoggedIn");
  const profileColor = localStorage.getItem("profileColor");
  const nickname = localStorage.getItem("nickname");
  const email = localStorage.getItem("email");
  return {
    isLoggedIn: local_login || false,
    profileColor: profileColor || "",
    nickname: nickname || "",
    email: email || "",
  };
}

export function LoginProvider({ children }) {
  const { isLoggedIn, profileColor, nickname, email } = checkLocal();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [userProfileColor, setUserProfileColor] = useState(profileColor);
  const [userNickname, setUserNickname] = useState(nickname);
  const [userEmail, setUserEmail] = useState(email);

  const resetLoginState = () => {
    setLoggedIn(false);
    setUserProfileColor("");
    setUserNickname("");
    setUserEmail("");
    localStorage.clear();
  };

  return (
    <>
      <loginContext.Provider
        value={{
          loggedIn,
          setLoggedIn,
          profileColor: userProfileColor,
          setProfileColor: setUserProfileColor,
          nickname: userNickname,
          setNickname: setUserNickname,
          email: userEmail,
          setEmail: setUserEmail,
          resetLoginState,
        }}
      >
        {children}
      </loginContext.Provider>
    </>
  );
}

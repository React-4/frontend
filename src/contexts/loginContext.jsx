/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
export const loginContext = createContext();

function checkLocal() {
  return {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true", // 문자열을 boolean으로 변환
    profileColor: localStorage.getItem("profileColor") || "",
    nickname: localStorage.getItem("nickname") || "",
    email: localStorage.getItem("email") || "",
  };
}

export function LoginProvider({ children }) {
  const { isLoggedIn, profileColor, nickname, email } = checkLocal();

  // 상태 관리
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [userProfileColor, setUserProfileColor] = useState(profileColor);
  const [userNickname, setUserNickname] = useState(nickname);
  const [userEmail, setUserEmail] = useState(email);

  // 로그아웃 시 상태 리셋
  const resetLoginState = () => {
    setLoggedIn(false);
    setUserProfileColor("");
    setUserNickname("");
    setUserEmail("");
    localStorage.clear();
  };

  return (
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
  );
}

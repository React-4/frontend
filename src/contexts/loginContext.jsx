/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { Cookies } from "react-cookie";

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
  const cookies = new Cookies();
  const { isLoggedIn, profileColor, nickname, email } = checkLocal();

  // 상태 관리
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [userProfileColor, setUserProfileColor] = useState(profileColor);
  const [userNickname, setUserNickname] = useState(nickname);
  const [userEmail, setUserEmail] = useState(email);
  const [token, setToken] = useState(cookies.get("token") || ""); // 쿠키에서 토큰 초기화

  // 로그아웃 시 상태 리셋
  const resetLoginState = () => {
    setLoggedIn(false);
    setUserProfileColor("");
    setUserNickname("");
    setUserEmail("");
    setToken("");
    localStorage.clear();
  };

  // 쿠키 변경 시 토큰 업데이트
  useEffect(() => {
    console.log(cookies, "cookies");
    const newToken = cookies.get("token");
    setToken(newToken || ""); // 쿠키가 없는 경우 빈 문자열로 설정
    console.log("Updated token:", newToken);
  }, [cookies]);

  // 디버깅용 로그
  useEffect(() => {
    console.log("Current token:", token);
  }, [token]);

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
        token,
      }}
    >
      {children}
    </loginContext.Provider>
  );
}

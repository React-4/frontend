/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
export const loginContext = createContext();

function checkLocal() {
  return {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true", // 문자열을 boolean으로 변환
    profileColor: localStorage.getItem("profileColor") || "",
    nickname: localStorage.getItem("nickname") || "",
    email: localStorage.getItem("email") || "",
    favoriteAnnouncementIds: JSON.parse(
      localStorage.getItem("favoriteAnnouncementIds") || "[]"
    ), // JSON 문자열을 배열로 변환
    favoriteStockIds: JSON.parse(
      localStorage.getItem("favoriteStockIds") || "[]"
    ), // JSON 문자열을 배열로 변환
  };
}

export function LoginProvider({ children }) {
  const {
    isLoggedIn,
    profileColor,
    nickname,
    email,
    favoriteAnnouncementIds,
    favoriteStockIds,
  } = checkLocal();

  // 상태 관리
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [userProfileColor, setUserProfileColor] = useState(profileColor);
  const [userNickname, setUserNickname] = useState(nickname);
  const [userEmail, setUserEmail] = useState(email);
  const [userFavoriteAnnouncementIds, setUserFavoriteAnnouncementIds] =
    useState(favoriteAnnouncementIds);
  const [userFavoriteStockIds, setUserFavoriteStockIds] =
    useState(favoriteStockIds);
  const [value, setValue] = useState("1");
  // 상태 변경 시 로컬 스토리지 업데이트
  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("profileColor", userProfileColor);
      localStorage.setItem("nickname", userNickname);
      localStorage.setItem("email", userEmail);
      localStorage.setItem(
        "favoriteAnnouncementIds",
        JSON.stringify(userFavoriteAnnouncementIds)
      );
      localStorage.setItem(
        "favoriteStockIds",
        JSON.stringify(userFavoriteStockIds)
      );
    } else {
      localStorage.clear();
    }
  }, [
    loggedIn,
    userProfileColor,
    userNickname,
    userEmail,
    userFavoriteAnnouncementIds,
    userFavoriteStockIds,
  ]);

  // 로그아웃 시 상태 리셋
  const resetLoginState = () => {
    setLoggedIn(false);
    setUserProfileColor("");
    setUserNickname("");
    setUserEmail("");
    setUserFavoriteAnnouncementIds([]);
    setUserFavoriteStockIds([]);
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
        favoriteAnnouncementIds: userFavoriteAnnouncementIds,
        setFavoriteAnnouncementIds: setUserFavoriteAnnouncementIds,
        favoriteStockIds: userFavoriteStockIds,
        setFavoriteStockIds: setUserFavoriteStockIds,
        resetLoginState,
        value,
        setValue,
      }}
    >
      {children}
    </loginContext.Provider>
  );
}

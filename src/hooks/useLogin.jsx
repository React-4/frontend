import { useContext } from "react";
import { loginContext } from "../contexts/loginContext";

export function useLogin() {
  const {
    loggedIn,
    setLoggedIn,
    profileColor,
    setProfileColor,
    email,
    setEmail,
    nickname,
    setNickname,
    favoriteAnnouncementIds,
    setFavoriteAnnouncementIds,
    favoriteStockIds,
    setFavoriteStockIds,
    resetLoginState,
  } = useContext(loginContext);

  return {
    loggedIn,
    setLoggedIn,
    profileColor,
    setProfileColor,
    email,
    setEmail,
    nickname,
    setNickname,
    favoriteAnnouncementIds,
    setFavoriteAnnouncementIds,
    favoriteStockIds,
    setFavoriteStockIds,
    resetLoginState,
  };
}

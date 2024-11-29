import { loginContext } from "../contexts/loginContext";
import { useContext } from "react";

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
    resetLoginState,
    token,
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
    resetLoginState,
    token,
  };
}

import { loginContext } from "../contexts/loginContext";
import { useContext } from "react";

export function useLogin() {
  const { loggedIn, setLoggedIn } = useContext(loginContext);

  return { loggedIn, setLoggedIn };
}

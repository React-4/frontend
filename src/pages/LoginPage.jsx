import React from "react";
import lock from "../assets/Lock.png";
import eyeOpen from "../assets/EyeOpen.png";
import check from "../assets/Check.png";
import checkLogin from "../assets/checkLogin.png";
import personalCard from "../assets/Personalcard.png";
import { Input, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [longLogin, setLongLogin] = useState(false);
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn } = useLogin();
  const handleLogin = () => {
    navigate("/");
    if (longLogin == true) {
      localStorage.setItem("login-token", email);
    }

    setLoggedIn(email);
  };

  return (
    <div className="flex flex-col items-center w-full gap-7 h-5/6 justify-center">
      <div className="font-bold text-2xl mb-10">로그인</div>
      <div className="flex flex-col w-full items-center">
        <TextField
          placeholder="이메일"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          variant="outlined"
          className="inputRoundedTop"
          sx={{ width: 1 / 3 }}
          value={email}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <img src={personalCard}></img>
                </InputAdornment>
              ),
            },
          }}
        />
        {/* <input
          placeholder="비밀번호"
          className="border-primary-2 border-2 rounded-b-xl w-1/3 p-3"
        /> */}
        <TextField
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
          }}
          variant="outlined"
          className="inputRoundedBottom"
          sx={{ width: 1 / 3 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <img src={lock}></img>
                </InputAdornment>
              ),
            },
          }}
        />
      </div>
      <div className="flex flex-row w-1/3 gap-2">
        <button>
          {longLogin == true ? (
            <img
              src={checkLogin}
              onClick={() => {
                setLongLogin(false);
              }}
            ></img>
          ) : (
            <img
              src={check}
              onClick={() => {
                setLongLogin(true);
              }}
            ></img>
          )}
        </button>
        <div>로그인 상태 유지</div>
      </div>
      <button
        onClick={handleLogin}
        className="bg-primary w-1/3 rounded-lg text-white p-3 text-lg font-bold"
      >
        로그인
      </button>
      <div onClick={() => navigate("/signup")}>아직 회원이 아니신가요?</div>
    </div>
  );
}
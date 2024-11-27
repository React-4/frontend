import React, { useState } from "react";
import lock from "/img/Lock.png";
import eyeOpen from "/img/EyeOpen.png";
import check from "/img/Check.png";
import checkLogin from "/img/checkLogin.png";
import personalCard from "/img/Personalcard.png";
import { Input, InputAdornment, TextField } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { BASE_URL } from "../utils/api";

export default function LoginPage() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [longLogin, setLongLogin] = useState(false);
  const navigate = useNavigate();
  const { setLoggedIn, setProfileColor } = useLogin();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      password: pw,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setLoggedIn(email);
        setProfileColor(data.data.profileColor);
        localStorage.setItem("login-token", email);
        localStorage.setItem("profileColor", data.data.profileColor); // profileColor를 로컬 스토리지에 저장
        const from = location.state?.from || "/"; // 원래 위치가 없으면 기본 경로로 이동
        navigate(from);
      }
      if (response.status === 400 || response.status === 401) {
        setErrorMessage("잘못된 이메일 또는 비밀번호");
      }
    } catch (error) {
      setErrorMessage("로그인 중 오류가 발생했습니다." + error);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col items-center w-full gap-7 h-5/6 justify-center"
    >
      <div className="font-bold text-2xl mb-10">로그인</div>
      <div className="flex flex-col w-full items-center">
        <TextField
          placeholder="이메일"
          onChange={(e) => setEmail(e.target.value)}
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
        <TextField
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
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
        <button type="button" onClick={() => setLongLogin(!longLogin)}>
          {longLogin ? <img src={checkLogin}></img> : <img src={check}></img>}
        </button>
        <div
          className="cursor-pointer"
          onClick={() => setLongLogin(!longLogin)}
        >
          로그인 상태 유지
        </div>
      </div>
      <button
        type="submit"
        onClick={handleLogin}
        className="bg-primary w-1/3 rounded-lg text-white p-3 text-lg font-bold"
      >
        로그인
      </button>
      <div className="cursor-pointer" onClick={() => navigate("/signup")}>
        아직 회원이 아니신가요?
      </div>
      {errorMessage && <div className="text-red-500 mt-1">{errorMessage}</div>}
    </form>
  );
}

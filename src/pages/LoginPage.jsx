import React, { useState } from "react";
import lock from "/img/Lock.png";
import eyeOpen from "/img/EyeOpen.png";
import check from "/img/Check.png";
import checkLogin from "/img/checkLogin.png";
import personalCard from "/img/Personalcard.png";
import { Input, InputAdornment, TextField } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { toast } from "react-toastify";

export default function LoginPage() {
  const location = useLocation();
  const [userInputEmail, setUserInputEmail] = useState("");
  const [pw, setPw] = useState("");
  const [longLogin, setLongLogin] = useState(false);
  const navigate = useNavigate();
  const { setLoggedIn, setProfileColor, setEmail, setNickname,setFavoriteAnnouncementIds,setFavoriteStockIds } = useLogin();
  const BASE_URL = import.meta.env.VITE_BACK_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    const userData = {
      email: userInputEmail,
      password: pw,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include", // 쿠키를 포함하여 요청
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("isLoggedIn", true);
        setLoggedIn(true);
        localStorage.setItem("profileColor", data.data.profileColor);
        setProfileColor(data.data.profileColor);
        localStorage.setItem("nickname", data.data.nickname);
        setNickname(data.data.nickname);
        localStorage.setItem("email", data.data.email);
        setEmail(data.data.email);
        localStorage.setItem("favoriteAnnouncementIds", JSON.stringify(data.data.favoriteAnnouncementIds));
        setFavoriteAnnouncementIds(data.data.favoriteAnnouncementIds);
        localStorage.setItem("favoriteStockIds", JSON.stringify(data.data.favoriteStockIds));
        setFavoriteStockIds(data.data.favoriteStockIds);


        const from = location.state?.from || "/"; // 원래 위치가 없으면 기본 경로로 이동
        navigate(from);
        toast.success("로그인 성공");
      }
      if (response.status === 400 || response.status === 401) {
        toast.error("잘못된 이메일 또는 비밀번호");
      }
    } catch (error) {
      toast.error("로그인 중 오류가 발생했습니다.");
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
          onChange={(e) => setUserInputEmail(e.target.value)}
          variant="outlined"
          className="inputRoundedTop"
          sx={{ width: 1 / 3 }}
          value={userInputEmail}
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
    </form>
  );
}

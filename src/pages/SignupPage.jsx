import React from "react";
import logoImg from "/img/disclo_white.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { BASE_URL } from "../utils/api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [rePw, setRePw] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지
    const userData = {
      nickname: nickname,
      password: pw,
      email: email,
      birthDate: birthDate + gender,
    };

    // 비밀번호 유효성 검사
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
    if (!passwordRegex.test(pw)) {
      setErrorMessage(
        "비밀번호는 8~12자 영문, 숫자, 특수문자 조합이어야 합니다."
      );
      return; // 유효성 검사 실패 시 함수 종료
    }

    if (pw !== rePw) {
      setErrorMessage("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return; // 비밀번호 불일치 시 함수 종료
    }

    setErrorMessage("");

    try {
      const response = await fetch(`${BASE_URL}/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        // 회원가입 성공 시 처리
        console.log(data.message);
        navigate("/"); // 성공 후 이동
      } else {
        if (response.status === 409) {
          alert("닉네임 또는 이메일 중복");
        }
      }
    } catch (error) {
      alert("회원가입 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between p-3 h-16 w-full text-center">
        <img src={logoImg} className="w-1/12 " onClick={() => navigate("/")} />
      </div>
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSignup}
      >
        <div className="font-bold text-2xl"> 회원가입</div>
        <div className="relative w-4/12">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-14 h-5 font-bold">
            닉네임
          </div>
          <input
            type="text"
            required
            className="border-primary border-1 rounded-xl h-14 w-full pl-20"
            value={nickname}
            maxLength={20}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>{" "}
        <div className="relative w-4/12">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-20 h-5 font-bold">
            생년월일
          </div>
          <div className="flex flex-row w-full items-center">
            <input
              type="text"
              className="border-primary border-1 rounded-xl h-14 w-1/2 pl-24"
              onChange={(e) => {
                const value = e.target.value;
                if (value.length === 6) {
                  setBirthDate(value);
                  document.getElementById("genderInput").focus();
                }
              }}
              maxLength={6}
              placeholder="YYMMDD"
            />
            <div className="border-1 border-primary w-3 m-6"></div>
            <input
              id="genderInput" // gender 입력 필드에 ID 추가
              type="text"
              className="border-primary border-1 p-3 rounded-xl h-14 w-1/12 "
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              maxLength={1}
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-primary-1 rounded-full h-10 w-1/12 ml-1"
              ></div>
            ))}
          </div>
        </div>{" "}
        <div className="relative w-4/12">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-14 h-5 font-bold">
            이메일
          </div>
          <input
            type="email"
            className="border-primary border-1 rounded-xl h-14 w-full pl-20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>{" "}
        <div className="relative w-4/12">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-20 h-5 font-bold">
            비밀번호
          </div>
          <input
            type="password"
            className="border-primary border-1 rounded-xl h-14 w-full pl-24"
            placeholder="8~12자 영문, 숫자, 특수문자"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            minLength={8}
            maxLength={12}
          />
        </div>
        <div className="relative w-4/12">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-24 h-5 font-bold">
            비밀번호 확인
          </div>
          <input
            type="password"
            className="border-primary border-1 rounded-xl h-14 w-full pl-32"
            placeholder="8~12자 영문, 숫자, 특수문자"
            value={rePw}
            onChange={(e) => setRePw(e.target.value)}
            minLength={8}
            maxLength={12}
          />
        </div>
        {errorMessage && <div className="text-red-500 m-1">{errorMessage}</div>}
        <FormGroup
          sx={{ display: "flex", width: 1 / 3, marginLeft: "15px", gap: 0 }}
        >
          <FormControlLabel
            sx={{ padding: 0 }}
            required
            control={<Checkbox />}
            label="필수 약관에 모두 동의"
          />
          <FormControlLabel
            required
            control={<Checkbox />}
            label="준회원 이용약관"
          />
          <FormControlLabel
            required
            control={<Checkbox />}
            label="개인정보 제3자 제공 동의"
          />{" "}
          <FormControlLabel
            control={<Checkbox />}
            label="(선택) 마케팅 정보 수신 동의"
          />
        </FormGroup>
        <button
          type="submit"
          className="bg-primary w-1/3 rounded-lg text-white p-3 text-lg font-bold hover"
        >
          가입완료
        </button>
      </form>
    </div>
  );
}

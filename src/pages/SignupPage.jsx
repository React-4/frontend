import React from "react";
import logoImg from "../assets/disclo_white.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

export default function SignupPage() {
  const navigate = useNavigate();
  const handleSignup = () => {
    //회원가입 연결
    navigate("/");
  };
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [rePw, setRePw] = useState("");
  return (
    <div>
      <div className="flex flex-row items-center justify-between p-3 h-16 w-full">
        <img src={logoImg} className="w-1/12 " onClick={() => navigate("/")} />
      </div>
      <form className="flex flex-col items-center gap-4">
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
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            <div className="border-1 border-primary w-3 m-3"></div>
            <input
              type="text"
              className="border-primary border-1 rounded-xl h-14 w-1/12 "
              value={gender}
              onChange={(e) => setGender(e.target.value)}
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
            className="border-primary border-1 rounded-xl h-14 w-full pl-24"
            placeholder="8~12자 영문, 숫자, 특수문자"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </div>
        <div className="relative w-4/12">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-24 h-5 font-bold">
            비밀번호 확인
          </div>
          <input
            className="border-primary border-1 rounded-xl h-14 w-full pl-32"
            placeholder="8~12자 영문, 숫자, 특수문자"
            value={rePw}
            onChange={(e) => setRePw(e.target.value)}
          />
        </div>
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
        <input
          value="가입완료"
          type="submit"
          className="bg-primary w-1/3 rounded-lg text-white p-3 text-lg font-bold"
          onClick={handleSignup}
        />
      </form>
    </div>
  );
}

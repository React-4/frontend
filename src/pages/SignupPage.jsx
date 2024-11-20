import React from "react";
import logoImg from "../assets/disclo_white.png";
import { useNavigate } from "react-router-dom";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

export default function SignupPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex flex-row items-center justify-between p-3 h-16 w-full">
        <img src={logoImg} className="w-1/12 " onClick={() => navigate("/")} />
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="font-bold text-2xl"> 회원가입</div>
        <div className="relative w-4/12">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-14 h-5 font-bold">
            닉네임
          </div>
          <input
            className="border-primary border-1 rounded-xl h-14 w-full pl-20"
            placeholder="검색어를 입력하세요"
          />
        </div>{" "}
        <div className="relative w-4/12">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-14 h-5 font-bold">
            생년월일
          </div>
          <input
            className="border-primary border-1 rounded-xl h-14 w-full pl-20"
            placeholder="검색어를 입력하세요"
          />
        </div>{" "}
        <div className="relative w-4/12">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-14 h-5 font-bold">
            이메일
          </div>
          <input
            className="border-primary border-1 rounded-xl h-14 w-full pl-20"
            placeholder="검색어를 입력하세요"
          />
        </div>{" "}
        <div className="relative w-4/12">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-14 h-5 font-bold">
            비밀번호
          </div>
          <input
            className="border-primary border-1 rounded-xl h-14 w-full pl-20"
            placeholder="8~12자 영문, 숫자, 특수문자"
          />
        </div>
        <div className="relative w-4/12">
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-24 h-5 font-bold">
            비밀번호 확인
          </div>
          <input
            className="border-primary border-1 rounded-xl h-14 w-full pl-28"
            placeholder="8~12자 영문, 숫자, 특수문자"
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
            required
            control={<Checkbox />}
            label="(선택) 마케팅 정보 수신 동의"
          />
        </FormGroup>
        <button className="bg-primary w-1/3 rounded-lg text-white p-3 text-lg font-bold">
          가입완료
        </button>
      </div>
    </div>
  );
}

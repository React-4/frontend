import React from "react";
import logoImg from "../assets/disclo_white.png";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex flex-row items-center justify-between p-3 h-16 w-full">
        <img src={logoImg} className="w-1/12 " onClick={() => navigate("/")} />
      </div>
      signup
    </div>
  );
}

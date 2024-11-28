import logoImg from "/img/disclo_white.png";
import { useLogin } from "../../hooks/useLogin";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import search from "/img/Search.png";

export default function Header() {
  const navigate = useNavigate();
  const { nickname, profileColor, loggedIn, resetLoginState } = useLogin();
  const [showTooltip, setShowTooltip] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const searchInputRef = useRef(null);

  const handleLogout = () => {
    resetLoginState();
    setShowTooltip(false);
    navigate("/");
  };

  useEffect(() => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  }, [location.pathname]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="hover:opacity-80 flex flex-row items-center justify-between p-3 h-16 w-full bg-white">
      <img
        src={logoImg}
        className="w-1/12 cursor-pointer hover:opacity-80 transition-opacity duration-200" // hover 효과 및 커서 변경
        onClick={() => navigate("/")}
      />
      <div className="relative w-4/12">
        <img
          src={search}
          alt="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 w-5 h-5"
        />
        <input
          ref={searchInputRef}
          className="border-primary border-2 rounded-3xl h-10 w-full pl-10"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>
      {loggedIn ? (
        <div className="relative">
          <button
            className={`rounded-full w-10 h-10 bg-profile-${profileColor} text-white`}
            onClick={() => setShowTooltip(true)}
          >
            {nickname.slice(0, 2)}
          </button>

          {showTooltip && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md z-10">
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  navigate("/mypage");
                  setShowTooltip(false);
                }}
              >
                마이페이지
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          className="bg-primary text-white h-10 w-20 rounded-xl text-l"
          onClick={() =>
            navigate("/login", { state: { from: window.location.pathname } })
          } // 현재 경로를 state로 전달
        >
          로그인
        </button>
      )}
    </div>
  );
}

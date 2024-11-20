import logoImg from "../../assets/disclo_white.png";
import { useLogin } from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import search from "../../assets/Search.png";

export default function Header() {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn } = useLogin();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLogout = () => {
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="flex flex-row items-center justify-between p-3 h-16 w-full">
      <img src={logoImg} className="w-1/12" onClick={() => navigate("/")} />
      <div className="relative w-4/12">
        <img
          src={search}
          alt="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 w-5 h-5"
        />
        <input
          className="border-primary border-2 rounded-3xl h-10 w-full pl-10"
          placeholder="검색어를 입력하세요"
        />
      </div>
      {/* <TextField
        placeholder="검색어를 입력하세요"
        variant="outlined"
        className="inputRounded h-10"
        sx={{ width: 1 / 3, height: "40px" }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <img src={search}></img>
              </InputAdornment>
            ),
          },
        }}
      /> */}

      {loggedIn ? (
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            className="rounded-full w-10 h-10 bg-pink-300"
            onClick={() => setShowTooltip(true)}
          >
            {loggedIn}
          </button>

          {showTooltip && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md z-10">
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                onClick={() => navigate("/mypage")}
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
          onClick={() => navigate("/login")}
        >
          로그인
        </button>
      )}
    </div>
  );
}

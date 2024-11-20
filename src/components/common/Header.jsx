import logoImg from "../../assets/disclo_white.png";
import { useLogin } from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn } = useLogin();
  return (
    <div className="flex flex-row items-center justify-between p-3 h-16 w-full">
      <img src={logoImg} className="w-1/12 " onClick={() => navigate("/")} />

      <input
        className="border-primary border-2 rounded-3xl h-10 w-4/12 p-3 placeholder "
        placeholder="검색어를 입력하세요"
      ></input>

      {loggedIn ? (
        <>
          <button className="rounded-full w-10 h-10 bg-pink-300">
            {loggedIn}
          </button>
        </>
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

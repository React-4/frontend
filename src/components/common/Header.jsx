import logoImg from "../../assets/disclo_white.png";

export default function Header() {
  return (
    <div className="flex flex-row items-center justify-between p-3 h-16 w-full">
      <img src={logoImg} className="w-1/12 " />

      <input
        className="border-primary border-2 rounded-3xl h-10 w-4/12 p-3 placeholder "
        placeholder="검색어를 입력하세요"
      ></input>

      <button className="bg-primary text-white h-10 w-20   rounded-xl text-l">
        로그인
      </button>
    </div>
  );
}

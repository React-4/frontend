import React from "react";
import EditInfo from "../components/mypage/EditInfo";
import MyComment from "../components/mypage/MyComment";

const commentData = [
  {
    id: 1,
    company: "삼성전자(주)",
    title: "해외증권시장주권상장폐지결정",
    date: "2024.10.25",
    comment:
      "일봉 기준 기울기 각도가 거진 80-90도가 되면 일봉 기준 기울기 각도가 거진 80-90도가 되면 일봉 기준 기울기 각도가 거진 80-90도가 되면 패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.",
  },
  {
    id: 2,
    company: "삼전(주)",
    title: "해외증권시장주권상장폐지결정",
    date: "2024.10.25",
    comment:
      "일봉 기준 기울기 각도가 거진 80-90도가 되면 일봉 기준 기울기 각도가 거진 80-90도가 되면 일봉 기준 기울기 각도가 거진 80-90도가 되면 패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.일봉 기준 기울기 각도가 거진 80-90도가 되면 일봉 기준 기울기 각도가 거진 80-90도가 되면 일봉 기준 기울기 각도가 거진 80-90도가 되면 패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다. 80-90도가 되면 일봉 기준 기울기 각도가 거진 80-90도가 되면 패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.",
  },
  {
    id: 3,
    company: "(주)삼성",
    title: "해외증권시장주권상장폐지결정",
    date: "2024.10.25",
    comment:
      "되면 일봉 기준 기울기 각도가 거진 80-90도가 되면 패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.",
  },
];
export default function MyPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="font-bold text-2xl m-5 w-2/3">내 정보</div>

      <EditInfo />
      <div className="font-bold text-2xl m-5 w-2/3">내가 쓴 댓글</div>
      {commentData.map((comment) => {
        return (
          <MyComment
            key={comment.id}
            title={comment.title}
            company={comment.company}
            date={comment.date}
            comment={comment.comment}
          />
        );
      })}
    </div>
  );
}

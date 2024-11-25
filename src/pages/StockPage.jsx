import React from "react";
import ApexChart from "../components/chart/ApexChart";
import ListTables from "../components/common/ListTables";
import CommentList from "../components/disclosure/CommentList";

const commentData = [
  {
    username: "유저1",
    date: "2024.10.12",
    comment:
      "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
  },
  {
    username: "asdf",
    date: "2024.10.12",
    comment:
      "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
  },
  {
    username: "유저3",
    date: "2024.10.12",
    comment:
      "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
  },
  {
    username: "유저4",
    date: "2024.10.12",
    comment:
      "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
  },
  {
    username: "유저5",
    date: "2024.10.12",
    comment:
      "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
  },
  {
    username: "유저6",
    date: "2024.10.12",
    comment:
      "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
  },
  {
    username: "유저7",
    date: "2024.10.12",
    comment:
      "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
  },
  {
    username: "유저8",
    date: "2024.10.12",
    comment:
      "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
  },
];

const disclosureData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  num: index + 1,
  company: `회사 ${index + 1}`,
  report: `보고서 ${index + 1}`,
  submitter: `제출자 ${index + 1}`,
  date: `2024-11-${(index % 30) + 1}`,
  votes: {
    good: Math.floor(Math.random() * 11),
    bad: Math.floor(Math.random() * 11),
  },
  comments: Math.floor(Math.random() * 50),
}));

const disclosureHeaders = [
  { key: "num", label: `전체 리스트 ${disclosureData.length}개` },
  { key: "company", label: "공시 대상 회사" },
  { key: "report", label: "보고서명" },
  { key: "submitter", label: "제출인" },
  { key: "date", label: "접수일자" },
  { key: "votes", label: "투표" },
  { key: "comments", label: "댓글수" },
];

export default function StockPage() {
  return (
    <div className="flex flex-col mb-12 m-3">
      <div className="flex flex-row  gap-2">
        <div className="font-semibold text-xl">삼성전자</div>
        <div className="text-primary-2 font-semibold text-lg ">005930</div>
      </div>
      <div className="flex flex-row gap-3">
        <div className="font-bold text-xl">50,900원</div>
        <div className="text-sm">
          어제보다{" "}
          <span className="text-primary-4 font-bold">-2000원 (3.7%)</span>
        </div>
      </div>
      <div>
        <div className="font-bold text-xl">차트</div>
        <ApexChart />
      </div>
      <div>
        <div className="font-bold text-xl">공시</div>
        <ListTables
          type="disclosure"
          data={disclosureData}
          headers={disclosureHeaders}
        />
      </div>
      <div>
        <div className="font-bold text-xl">댓글</div>
        <div className="mx-4">
          <CommentList commentData={commentData} />
        </div>
      </div>
    </div>
  );
}

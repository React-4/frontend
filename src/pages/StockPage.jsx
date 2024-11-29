import React from "react";
import ApexChart from "../components/chart/ApexChart";
import ListTables from "../components/common/ListTables";
import CommentList from "../components/disclosure/CommentList";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCommentByStock } from "../services/commentAPI";
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
  const location = useLocation();
  const stockData = location.state.data[0];
  console.log(stockData);
  const calculatePriceChange = (currentPrice, changeRate) => {
    let price = Math.round(
      (Number(currentPrice.slice(0, -2)) /
        (1 + Number(changeRate.slice(0, -1)) / 100)) *
        (Number(changeRate.slice(0, -1)) / 100)
    );
    console.log(changeRate.slice(0, 1));

    return price;
  };
  const changePrice = calculatePriceChange(
    stockData.price,
    stockData.changeRate
  );
  const [chartType, setChartType] = useState("day");
  const [comment, setComment] = useState([]);
  useEffect(() => {
    getCommentByStock(stockData.id).then((data) => setComment(data));
  }, []);

  console.log("comm", comment);
  return (
    <div className="flex flex-col mb-12 m-3">
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-row gap-2">
          <div className="font-semibold text-xl">{stockData.name}</div>
          <div className="text-primary-2 font-semibold text-lg ">
            {stockData.code}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <button
            className={`w-12 h-6 ${
              chartType === "day"
                ? " bg-primary text-white "
                : " bg-white text-black"
            } rounded-md flex align-items justify-center`}
            onClick={() => setChartType("day")}
          >
            일봉
          </button>
          <button
            className={`w-12 h-6 ${
              chartType === "week"
                ? " bg-primary text-white "
                : " bg-white text-black"
            } rounded-md flex align-items justify-center`}
            onClick={() => setChartType("week")}
          >
            주봉
          </button>{" "}
          <button
            className={`w-12 h-6 ${
              chartType === "month"
                ? " bg-primary text-white "
                : " bg-white text-black"
            } rounded-md flex align-items justify-center`}
            onClick={() => setChartType("month")}
          >
            월봉
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-3 items-center">
        <div className="font-bold text-xl">{stockData.price}</div>
        <div className="text-sm">
          어제보다
          <span
            className={`${
              changePrice < 0 ? "text-primary-4" : "text-primary-3"
            } font-bold ml-1`}
          >
            {changePrice}원 ({stockData.changeRate})
          </span>
        </div>
      </div>
      <div>
        <ApexChart name="test" stockId={stockData.id} type={chartType} />
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
          <CommentList commentData={comment} />
        </div>
      </div>
    </div>
  );
}

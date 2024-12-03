import React from "react";
import axios from "axios";
import ApexChart from "../components/chart/ApexChart";
import ListTables from "../components/common/ListTables";
import CommentList from "../components/disclosure/CommentList";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCommentByStock } from "../services/commentAPI";
import { addToHistory } from "../utils/history";
import { Pagination } from "@mui/material";
import '../components/css/SearRes.css';

const BASE_URL = import.meta.env.VITE_BACK_URL;

export default function StockPage() {
  const [totalstockDatas, setTotalStockDatas] = useState([]);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [chartType, setChartType] = useState("day");
  const [comment, setComment] = useState([]);
  const pageSize = 10;

  const getStockIdFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/\/stock\/(\d+)/); // "/stock/:stock_id" 패턴 매칭
    return match ? parseInt(match[1], 10) : null; 
  };
  
  const stock_id = getStockIdFromUrl();
console.log("Extracted and converted stock_id:", stock_id, typeof stock_id);

useEffect(() => {
  console.log("useEffect triggered");
  console.log("stock_id:", stock_id);
}, [stock_id]);
// 최초 렌더링 시 공시 데이터와 댓글 데이터 가져오기
useEffect(() => {
  // fetchAnnouncementData();
  console.log("useEffect called with stock_id:", stock_id);
if (stock_id) {
  console.log("띨띨롱");
  fetchAnnouncementData();
}
  getCommentByStock(stock_id).then((data) => setComment(data));
}, [stock_id]);

console.log("BASE_URL:", BASE_URL);


  const fetchAnnouncementData = async (page = 1) => {
    try {
      console.log("fetchAnnouncementData called with page:", page);

      const response = await axios.get(
        `${BASE_URL}/api/announcement/stock/${stock_id}`, // stock_id를 URL 경로에 포함
        {
          params: {
            sortBy: "latest",
            page,
            size: pageSize,
          },
        }
      );
      console.log("!!!response: ", response.data);

      if (response.status === 200) {
        const { announcementList = [], announcementCount } = response.data?.data || {};
        setTotalStockDatas(announcementList);
        console.log("announcementList: ", announcementList);
        setTotalAnnouncements(announcementCount);
      } else {
        console.error("!!Failed to fetch announcement data:", response.data?.message);
      }
    } catch (error) {
      console.error("!!!!Error fetching announcement data:", error);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchAnnouncementData(value);
  };

  
  const disclosureHeaders = [
    { key: "id", label: `전체 ${fetchAnnouncementData.length}개`, width: "10%"},
    { key: "company", label: "공시 대상 회사", width: "18%" },
    { key: "report", label: "보고서명", width: "25%" },
    { key: "submitter", label: "제출인", width: "18%" },
    { key: "date", label: "접수일자", width: "10%" },
    { key: "votes", label: "투표", width: "12%" },
    { key: "comments", label: "댓글수", width: "7%" },
];

  if (!totalstockDatas) return <div>Loading...</div>;

  const location = useLocation();
  const stockData = location.state.data[0];
  console.log("location.state", location.state);
  const calculatePriceChange = (currentPrice, changeRate) => {
    let price = Math.round(
      (Number(currentPrice.slice(0, -2)) /
        (1 + Number(changeRate.slice(0, -1)) / 100)) *
        (Number(changeRate.slice(0, -1)) / 100)
    );

    return price;
  };
  const changePrice = calculatePriceChange(
    stockData.price,
    stockData.changeRate
  );

  const stockItem = {
    id: stockData.id,
    company: stockData.name,
    price: stockData.price,
    gap: changePrice,
    rate: stockData.changeRate,
    code: stockData.code,
    transaction: stockData.transaction,
  };
  addToHistory("stock", stockItem);

  return (
    <div className="flex flex-col mb-12 m-3">
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-row items-center">
          <img
            src={`https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${stockData.code}.png`}
            alt={`${stockData.code} 아이콘`}
            style={{
              width: "50px",
              height: "50px",
              marginRight: "0.3em",
            }} // 크기 및 여백 조정
            className="rounded-xl"
          />
          <div className="flex flex-row gap-2">
            <div className="font-semibold text-xl">{stockData.name}</div>
            <div className="text-primary-2 font-semibold text-lg ">
              {stockData.code}
            </div>
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
          data={stockData}
          headers={disclosureHeaders}
        />
        <Pagination
          count={totalAnnouncements}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
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

import React, { useState, useEffect } from "react";
import ApexChart from "../components/chart/ApexChart";
import ListTables from "../components/common/ListTables";
import CommentList from "../components/disclosure/CommentList";
import { useLocation } from "react-router-dom";
import { getCommentByStock } from "../services/commentAPI";
import { addToHistory } from "../utils/history";
import "../components/css/SearRes.css";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  addFavoriteStockAPI,
  removeFavoriteStockAPI,
} from "../services/stockAPI";

const BASE_URL = import.meta.env.VITE_BACK_URL;

export default function StockPage() {
  const location = useLocation();
  console.log(location.state);
  const stockData = location.state.data[0];
  console.log(stockData);
  console.log("stockData ", stockData);
  const [disclosureData, setDisclosureData] = useState([]);
  const [filteredDisclosureData, setFilteredDisclosureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentDisclosurePage, setCurrentDisclosurePage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  const getStockIdFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/\/stock\/(\d+)/); // /stock/:stock_id
    return match ? parseInt(match[1], 10) : null;
  };

  const stock_id = getStockIdFromUrl();
  console.log("Extracted stock_id:", stock_id);

  const [chartType, setChartType] = useState("day");
  const [comment, setComment] = useState([]);

  const fetchDisclosureData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/api/announcement/stock/${stock_id}`,
        {
          params: { sortBy: "latest", page: page - 1, size: 10 },
        }
      );
      console.log("Fetched disclosure data:", response.data);

      if (response.status === 200) {
        const { announcementList = [], announcementCount } =
          response.data.data || {};
        setDisclosureData(announcementList);
        setTotalPages(announcementCount);
        setFilteredDisclosureData(
          announcementList.map((item) => ({
            id: item.announcementId,
            company: item.stockName,
            report: item.title,
            submitter: item.submitter,
            date: item.announcementDate,
            votes: {
              good: item.positiveVoteCount,
              bad: item.negativeVoteCount,
            },
            comments: item.commentCount,
          }))
        );
      } else {
        console.error(
          "Failed to fetch disclosure data:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching disclosure data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentDisclosurePage(value);
    fetchDisclosureData(value);
  };

  useEffect(() => {
    getCommentByStock(stockData.id).then((data) => setComment(data));
  }, [stockData.id]);

  // 공시 데이터 로드
  useEffect(() => {
    if (stock_id) fetchDisclosureData();
  }, [stock_id]);

  // 로컬 스토리지에서 초기화
  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favoriteStockIds") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  const disclosureHeaders = [
    {
      key: "id",
      label: `전체 ${filteredDisclosureData.length}개`,
      width: "10%",
    },
    { key: "company", label: "공시 대상 회사", width: "18%" },
    { key: "report", label: "보고서명", width: "25%" },
    { key: "submitter", label: "제출인", width: "18%" },
    { key: "date", label: "접수일자", width: "10%" },
    { key: "votes", label: "투표", width: "12%" },
    { key: "comments", label: "댓글수", width: "7%" },
  ];

  const calculatePriceChange = (currentPrice, changeRate) => {
    let price = Math.round(
      (Number(currentPrice.replaceAll(",", "").slice(0, -1)) /
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

  if (loading) return <div>Loading...</div>;

  const handleFavoriteToggle = async (id) => {
    console.log(id);
    try {
      if (favorites.includes(id)) {
        await removeFavoriteStockAPI(id);
        setFavorites((prev) => prev.filter((favId) => favId !== id));
      } else {
        await addFavoriteStockAPI(id);
        setFavorites((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="flex flex-col mb-12 m-3">
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-row items-center">
          <img
            src={`https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${stockData.code}.png`}
            alt={`${stockData.code} 아이콘`}
            style={{
              width: "45px",
              height: "45px",
              marginRight: "0.5em",
            }}
            className="rounded-xl"
          />
          <div className="flex flex-row gap-2">
            <div className="font-semibold text-xl">{stockData.name}</div>
            <div className="text-primary-2 font-semibold text-lg ">
              {stockData.code}
            </div>
          </div>
          <span
            className="heart pl-5"
            onClick={(e) => {
              e.stopPropagation(); // 좋아요 클릭 시 행 이동 이벤트 중단
              handleFavoriteToggle(stockData.id);
            }}
            style={{ cursor: "pointer" }}
          >
            {favorites.includes(stockData.id) ? (
              <FavoriteIcon style={{ color: "#F04452" }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </span>
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
            {changePrice > 0 ? `+` : null}
            {Number(changePrice).toLocaleString()}원 ({stockData.changeRate})
          </span>
        </div>
      </div>
      <div>
        <ApexChart
          name="test"
          stockId={stockData.id}
          type={chartType}
          company={stockData.name}
        />
      </div>
      <div>
        <div className="font-bold text-xl pl-5">공시</div>
        <ListTables
          type="disclosure"
          data={filteredDisclosureData}
          headers={disclosureHeaders}
        />
        <div className="pagination-container">
          <Pagination
            count={totalPages}
            page={currentDisclosurePage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </div>
      <div>
        <div className="font-bold text-xl pl-5">댓글</div>
        <div className="mx-4">
          {stockData.comment && stockData.comment.length > 0 ? (
            <CommentList commentData={stockData.comment} />
          ) : (
            <div className="flex items-center justify-center w-full h-72 rounded-lg mt-5">
              <span className="text-2xl font-medium text-black text-center">
                공시 댓글이 없습니다.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

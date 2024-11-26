import React, { useState, useEffect } from "react";
import ListTables from "../components/common/ListTables";
import stockJson from "../components/dummy/stock.json";
import axios from "axios";

const MainPage = () => {
  const [disclosureSortType, setDisclosureSortType] = useState("latest");
  const [stockSortType, setStockSortType] = useState("amount");
  const [disclosureData, setDisclosureData] = useState([]);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchDisclosureData = async () => {
      try {
        const response = await axios.get(
          "http://43.203.154.25:8080/api/announcement",
          {
            params: {
              sortBy: disclosureSortType,
              page: 0,
              size: 10,
            },
          }
        );

        const disclosures = response.data.announcementList.map((announcement) => ({
          id: announcement.announcementId,
          num: announcement.announcementId,
          company: announcement.stockName,
          report: announcement.title.trim(),
          submitter: announcement.submitter,
          date: announcement.announcementDate,
          votes: {
            good: announcement.positiveVoteCount,
            bad: announcement.negativeVoteCount,
          },
          comments: announcement.commentCount,
        }));

        setDisclosureData(disclosures);
      } catch (error) {
        console.error("Failed to fetch disclosure data:", error);
      }
    };

    fetchDisclosureData();
  }, [disclosureSortType]);

  useEffect(() => {
    const stockData = Object.values(stockJson.data).map((stock, index) => ({
      id: index + 1,
      num: index + 1,
      name: `종목 ${index + 1}`, // JSON 데이터에 이름 정보가 없어서 추가
      code: stock["종목코드"],
      price: `${stock["현재가"]} 원`,
      changeRate: `${stock["등락률"]}%`,
      transaction: `${stock["거래량"]} 주`,
    }));
    setStockData(stockData);
  }, []);

  const disclosureHeaders = [
    { key: "num", label: `전체 리스트 ${disclosureData.length}개` },
    { key: "company", label: "공시 대상 회사" },
    { key: "report", label: "보고서명" },
    { key: "submitter", label: "제출인" },
    { key: "date", label: "접수일자" },
    { key: "votes", label: "투표" },
    { key: "comments", label: "댓글수" },
  ];

  const disclosureSortOptions = [
    { key: "latest", label: "최신순" },
    { key: "views", label: "조회수 순" },
    { key: "comments", label: "댓글 많은 순" },
    { key: "votes", label: "투표수" },
  ];

  const stockHeaders = [
    { key: "num", label: `검색된 주식${stockData.length}개` },
    { key: "name", label: "종목명" },
    { key: "code", label: "종목코드" },
    { key: "price", label: "현재가" },
    { key: "changeRate", label: "등락률" },
    { key: "transaction", label: "거래량" },
  ];

  const stockSortOptions = [
    { key: "amount", label: "거래대금 순" },
    { key: "volume", label: "거래량 순" },
    { key: "change_rate_up", label: "상승률 순" },
    { key: "change_rate_down", label: "하락률 순" },
  ];

  const handleDisclosureSortChange = (key) => {
    setDisclosureSortType(key);
  };

  const handleStockSortChange = (key) => {
    setStockSortType(key);
  };

  const sortedDisclosureData = [...disclosureData].sort((a, b) => {
    switch (disclosureSortType) {
      case "latest":
        return new Date(b.date) - new Date(a.date);
      case "votes":
        const totalVotesA = a.votes.good + a.votes.bad;
        const totalVotesB = b.votes.good + b.votes.bad;
        return totalVotesB - totalVotesA;
      case "comments":
        return b.comments - a.comments;
      default:
        return 0;
    }
  });

  const sortedStockData = [...stockData].sort((a, b) => {
    switch (stockSortType) {
      case "amount":
        const amountA =
          parseFloat(a.price.replace(/[^0-9.-]+/g, "")) *
          parseFloat(a.transaction.replace(/[^0-9.-]+/g, ""));
        const amountB =
          parseFloat(b.price.replace(/[^0-9.-]+/g, "")) *
          parseFloat(b.transaction.replace(/[^0-9.-]+/g, ""));
        return amountB - amountA;

      case "volume":
        return (
          parseFloat(b.transaction.replace(/[^0-9.-]+/g, "")) -
          parseFloat(a.transaction.replace(/[^0-9.-]+/g, ""))
        );
      case "change_rate_up":
        return (
          parseFloat(b.changeRate.replace(/[^0-9.-]+/g, "")) -
          parseFloat(a.changeRate.replace(/[^0-9.-]+/g, ""))
        );

      case "change_rate_down":
        return (
          parseFloat(a.changeRate.replace(/[^0-9.-]+/g, "")) -
          parseFloat(b.changeRate.replace(/[^0-9.-]+/g, ""))
        );
      default:
        return 0;
    }
  });

  return (
    <div>
      <h2 className="list-title">공시</h2>
      <div className="sort-buttons">
        {disclosureSortOptions.map((option) => (
          <button
            key={option.key}
            className={disclosureSortType === option.key ? "active" : ""}
            onClick={() => handleDisclosureSortChange(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ListTables
        type="disclosure"
        data={sortedDisclosureData}
        headers={disclosureHeaders}
      />

      <h2 className="list-title">종목</h2>
      <div className="sort-buttons">
        {stockSortOptions.map((option) => (
          <button
            key={option.key}
            className={stockSortType === option.key ? "active" : ""}
            onClick={() => handleStockSortChange(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <ListTables type="stock" data={sortedStockData} headers={stockHeaders} />
    </div>
  );
};

export default MainPage;

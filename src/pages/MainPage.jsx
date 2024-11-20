import React, {useState} from "react";
import ListTables from "../components/common/ListTables";

const MainPage = () => {
  const [disclosureSortType, setDisclosureSortType] = useState("latest");

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
    { key: "num", label: `전체 리스트 ${disclosureData.length}개`},
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

  const handleDisclosureSortChange = (key) => {
    setDisclosureSortType(key);
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

  const [stockSortType, setStockSortType] = useState("price");

  const stockData = Array.from({ length: 28 }, (_, index) => ({
    id: index + 1,
    num: index + 1,
    name: `종목명 ${index + 1}`,
    code: `${Math.floor(Math.random() * (999999-100000+1))+100000}`.toString(),
    price: `${Math.floor(Math.random() * 9001)+1000} 억 원`,
    changeRate: `${(Math.random() * 10 - 5).toFixed(2)}%`,
    marketCap: `${Math.floor(Math.random() * 9001)+1000} 억 원`,
    transaction: `${Math.floor(Math.random() * 19001)+1000} 억 원`,
  }));

  const stockHeaders = [
    { key: "num", label: `검색된 주식${stockData.length}개` },
    { key: "name", label: "종목명" },
    { key: "code", label: "종목코드" },
    { key: "price", label: "현재가" },
    { key: "changeRate", label: "등락률" },
    { key: "marketCap", label: "시가총액" },
    { key: "transaction", label: "거래량" },
  ];

  const stockSortOptions = [
    { key: "price", label: "가격대별 순" },
    { key: "changeRate", label: "등락률 순" },
    { key: "transaction", label: "거래량 순" },
  ];

  const handleStockSortChange = (key) => {
    setStockSortType(key);
  };

  const sortedStockData = [...stockData].sort((a, b) => {
    switch (stockSortType) {
      case "price":
        return parseFloat(b.price.replace(/[^0-9.-]+/g, "")) - parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
      case "changeRate":
        return parseFloat(b.changeRate.replace(/[^0-9.-]+/g, "")) - parseFloat(a.changeRate.replace(/[^0-9.-]+/g, ""));
      case "transaction":
        return parseFloat(b.transaction.replace(/[^0-9.-]+/g, "")) - parseFloat(a.transaction.replace(/[^0-9.-]+/g, ""));
      default:
        return 0;
    }
  });

  return (
    <div>
      <ListTables
        title="공시"
        data={sortedDisclosureData}
        headers={disclosureHeaders}
        sortOptions={disclosureSortOptions}
        sortType={disclosureSortType}
        onSortChange={handleDisclosureSortChange}
      />

      <ListTables
        title="종목"
        data={sortedStockData}
        headers={stockHeaders}
        sortOptions={stockSortOptions}
        sortType={stockSortType}
        onSortChange={handleStockSortChange}
      />

    </div>
  );
};

export default MainPage;

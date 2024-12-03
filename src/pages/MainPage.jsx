import React, { useState, useEffect } from "react";
import ListTables from "../components/common/ListTables";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const MainPage = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //공시
  const [disclosureSortType, setDisclosureSortType] = useState("latest");
  const [disclosureData, setDisclosureData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDisclosure, setTotalDisclosure] = useState(0);
  const [currentDPage, setCurrentDPage] = useState(1);
  const pageDSize = 10;
  const BASE_URL = import.meta.env.VITE_BACK_URL;

  const fetchDisclosureData = async (userPage, sortType) => {
    try {
      const apiPage = userPage - 1;
      const response = await axios.get(`${BASE_URL}/api/announcement`, {
        params: {
          sortBy: sortType,
          page: apiPage,
          size: pageDSize,
        },
      });

      const { announcementList, announcementCount } = response.data?.data || {};

      setTotalPages(announcementCount);

      setDisclosureData(
        announcementList.map((item) => ({
          id: item.announcementId,
          company: item.stockName,
          ticker: item.ticker,
          report: item.title?.trim() || "N/A",
          submitter: item.submitter || "Unknown",
          date: item.announcementDate || "Unknown",
          votes: {
            good: item.positiveVoteCount || 0,
            bad: item.negativeVoteCount || 0,
          },
          comments: item.commentCount || 0,
        }))
      );

      if (userPage === 1) {
        const lastPageResponse = await axios.get(
          `${BASE_URL}/api/announcement`,
          {
            params: {
              sortBy: disclosureSortType,
              page: announcementCount - 1,
              size: pageDSize,
            },
          }
        );
        const lastPageData =
          lastPageResponse.data?.data?.announcementList || [];
        const totalDataCount =
          (announcementCount - 1) * pageDSize + lastPageData.length;
        setTotalDisclosure(totalDataCount);
      }
    } catch (error) {
      console.error("Failed to fetch disclosure data:", error);
    }
  };

  useEffect(() => {
    fetchDisclosureData(1);
  }, [disclosureSortType]);

  const handleDPageClick = (event, userPage) => {
    setCurrentDPage(userPage);
    fetchDisclosureData(userPage);
  };

  const handleDisclosureSortChange = (key) => {
    setDisclosureSortType(key);
    setCurrentDPage(1);
    fetchDisclosureData(1, key);
  };

  const disclosureHeaders = [
    { key: "id", label: `전체 ${totalDisclosure}개`, width: "10%" },
    { key: "company", label: "공시 대상 회사", width: "18%" },
    { key: "report", label: "보고서명", width: "25%" },
    { key: "submitter", label: "제출인", width: "18%" },
    { key: "date", label: "접수일자", width: "10%" },
    { key: "votes", label: "투표", width: "12%" },
    { key: "comments", label: "댓글수", width: "7%" },
  ];

  const disclosureSortOptions = [
    { key: "latest", label: "최신순" },
    { key: "comment", label: "댓글 많은 순" },
    { key: "vote", label: "투표수" },
  ];

  //종목
  const [stockSortType, setStockSortType] = useState("amount");
  const [stockData, setStockData] = useState([]);
  const [currentSPage, setCurrentSPage] = useState(1);
  const pageSSize = 10;

  const fetchStockData = async (sortType) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/stockprice/rank`, {
        params: {
          sort_by: sortType,
        },
      });

      const data = response.data?.data || {};
      const formattedData = Object.keys(data).map((key) => ({
        id: data[key]["종목id"],
        name: data[key]["종목명"],
        code: data[key]["종목코드"],
        price: `${Number(data[key]["현재가"]).toLocaleString()}원`,
        changeRate: `${data[key]["등락률"]}%`,
        transaction: `${Number(data[key]["거래량"]).toLocaleString()}주`,
      }))
      
      const filteredData = formattedData.filter((item) =>
        Object.values(item).every((value) => value !== null)
      );
      setStockData(filteredData);
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
    }
  };

  useEffect(() => {
    fetchStockData(stockSortType);
    setCurrentSPage(1);
  }, [stockSortType]);

  const handleSPageClick = (event, page) => {
    setCurrentSPage(page);
  };

  const handleStockSortChange = (key) => {
    setStockSortType(key);
  };

  const startIndex = (currentSPage - 1) * pageSSize;
  const endIndex = startIndex + pageSSize;
  const currentSData = stockData.slice(startIndex, endIndex);

  const stockHeaders = [
    { key: "id", label: `전체 ${stockData.length}개`, width: "10%" },
    { key: "name", label: "종목명", width: "20%" },
    { key: "code", label: "종목코드", width: "10%" },
    { key: "price", label: "현재가", width: "10%" },
    { key: "changeRate", label: "등락률", width: "10%" },
    { key: "transaction", label: "거래량", width: "10%" },
  ];

  const stockSortOptions = [
    { key: "amount", label: "거래대금 순" },
    { key: "volume", label: "거래량 순" },
    { key: "change_rate_up", label: "상승률 순" },
    { key: "change_rate_down", label: "하락률 순" },
  ];

  return (
    <TabContext value={value}>
      <Box
        sx={{
          marginTop: "1rem",
          borderBottom: 1,
          borderColor: "divider",
          marginLeft: "2rem",
          marginRight: "2rem",
        }}
      >
        <TabList onChange={handleChange} aria-label="category tab">
          <Tab
            label="공시"
            value="1"
            sx={{ fontSize: "25px", fontWeight: "bold" }}
          />
          <Tab
            label="종목"
            value="2"
            sx={{ fontSize: "25px", fontWeight: "bold" }}
          />
        </TabList>
      </Box>
      <TabPanel value="1" sx={{ padding: "10px" }}>
        {/* <h2 className="list-title">공시</h2> */}
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
          data={disclosureData}
          headers={disclosureHeaders}
        />
        <div className="pagination-container">
          <Pagination
            count={totalPages}
            page={currentDPage}
            onChange={handleDPageClick}
            color="primary"
          />
        </div>
      </TabPanel>
      <TabPanel value="2"  sx={{ padding: "10px" }}>
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
        <ListTables type="stock" data={currentSData} headers={stockHeaders} />
        <div className="pagination-container">
          <Pagination
            count={Math.ceil(stockData.length / pageSSize)}
            page={currentSPage}
            onChange={handleSPageClick}
            color="primary"
          />
        </div>
      </TabPanel>
      <TabPanel value="3">Item Three</TabPanel>
    </TabContext>

    // <div>
    //   <h2 className="list-title">공시</h2>
    //   <div className="sort-buttons">
    //     {disclosureSortOptions.map((option) => (
    //       <button
    //         key={option.key}
    //         className={disclosureSortType === option.key ? "active" : ""}
    //         onClick={() => handleDisclosureSortChange(option.key)}
    //       >
    //         {option.label}
    //       </button>
    //     ))}
    //   </div>

    //   <ListTables
    //     type="disclosure"
    //     data={disclosureData}
    //     headers={disclosureHeaders}
    //   />

    //   <div className="pagination-container z-0">
    //     <Pagination
    //       count={totalPages}
    //       page={currentDPage}
    //       onChange={handleDPageClick}
    //       color="primary"
    //     />
    //   </div>

    //   <h2 className="list-title">종목</h2>
    //   <div className="sort-buttons">
    //     {stockSortOptions.map((option) => (
    //       <button
    //         key={option.key}
    //         className={stockSortType === option.key ? "active" : ""}
    //         onClick={() => handleStockSortChange(option.key)}
    //       >
    //         {option.label}
    //       </button>
    //     ))}
    //   </div>
    //   <ListTables type="stock" data={currentSData} headers={stockHeaders} />

    //   <div className="pagination-container">
    //     <Pagination
    //       count={Math.ceil(stockData.length / pageSSize)}
    //       page={currentSPage}
    //       onChange={handleSPageClick}
    //       color="primary"
    //     />
    //   </div>
    // </div>
  );
};

export default MainPage;
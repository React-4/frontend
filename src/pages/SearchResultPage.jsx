import React, {useState, useEffect} from "react";
import ListTables from "../components/common/ListTables";
import '../components/css/SearRes.css';
import { useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import axios from "axios";

const SearchResultPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query") || "";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredStockData, setFilteredStockData] = useState([]);
    const [filteredDisclosureData, setFilteredDisclosureData] = useState([]);
    const [filters, setFilters] = useState({
        keyword: "",
        sortBy: "latest",
        period: "",
        marketType: "",
        type: [],
      });
    const pageSize = 10;
    const [currentStockPage, setCurrentStockPage] = useState(1);
    const [currentDisclosurePage, setCurrentDisclosurePage] = useState(1);
    const [totalStockPages, setTotalStockPages] = useState(1);
    const [totalDisclosurePages, setTotalDisclosurePages] = useState(1);
    
    const fetchStockData = async (page) => {
        try {
            const apiPage = page - 1;
            const searchResponse = await axios.get(
                `http://43.203.154.25:8080/api/stock/search`,
                {
                  params: { 
                    keyword: searchQuery,
                    page: apiPage,
                    size: pageSize,
                  },
                }
            );
            const { data: searchData = [], totalSCount = 0 } = searchResponse.data?.data || [];
            setTotalStockPages(Math.ceil(totalSCount / pageSize));
            const rankResponse = await axios.get(
                "http://43.203.154.25:8080/api/stockprice/rank",
                {
                  params: { sort_by: "change_rate_up" }, //여기 수정해야함 지금 amount 데이터 없어서 안됨
                }
            );

            const rankData = rankResponse.data?.data || {};

            const updatedData = await Promise.all(
                searchData.map(async (stock) => {
                  const ticker = stock.ticker;
                  const priceData = Object.values(rankData).find(
                    (item) => item["종목코드"] === ticker
                  );
          
                  try {
                    const tickerResponse = await axios.get(
                      `http://43.203.154.25:8080/api/stock/ticker/${ticker}`
                    );
          
                    const companyName = tickerResponse.data?.data?.companyName || "알 수 없음";
                    const stockId = tickerResponse.data?.data?.stockId || stock.id;
          
                    return {
                      id: stockId, 
                      num: stockId, 
                      code: ticker,
                      name: companyName, 
                      price: priceData?.현재가 ? `${priceData.현재가} 원` : "None", 
                      changeRate: priceData?.등락률 ? `${priceData.등락률}%` : "None",
                      transaction: priceData?.거래량 ? `${priceData.거래량} 주` : "None",
                    };
                  } catch (tickerError) {
                    console.error(`Failed to fetch additional data for ticker ${ticker}`, tickerError);
          
                    return {
                      id: stock.id,
                      num: stock.id,
                      code: ticker,
                      name: stock.companyName,
                      price: priceData?.현재가 ? `${priceData.현재가} 원` : "None", 
                      changeRate: priceData?.등락률 ? `${priceData.등락률}%` : "None",
                      transaction: priceData?.거래량 ? `${priceData.거래량} 주` : "None", 
                    };
                  }
                })
              );
    
          setFilteredStockData(updatedData);

          const filtered = updatedData.filter((item) =>
            item.name.includes(searchQuery)
          );
          setFilteredStockData(filtered);
        } catch (error) {
          console.error("Failed to fetch stock data:", error);
        }
      };
      
    const stockHeaders = [
        { key: "num", label: `전체 ${filteredStockData.length}개`, width: "10%" },
        { key: "name", label: "종목명", width: "20%"  },
        { key: "code", label: "종목코드",  width: "10%"  },
        { key: "price", label: "현재가", width: "10%" },
        { key: "changeRate", label: "등락률", width: "10%"  },
        { key: "transaction", label: "거래량", width: "10%"  },
    ];

    useEffect(() => {
        fetchStockData(1);
    }, [searchQuery]);

    const handleStockPageClick = (event, page) => {
        setCurrentStockPage(page);
        fetchStockData(page);
    };

    //공시

    const fetchInitialDisclosureData = async () => {
        try {
            const response = await axios.get(
                "http://43.203.154.25:8080/api/announcement/search",
                {
                    params: {
                        keyword: searchQuery, 
                        sortBy: "latest",
                        page: 0,
                        size: pageSize,
                    },
                }
            );
            const { announcementList = [] } = response.data?.data || {};
            const formattedData = announcementList.map((item) => ({
                id: item.announcementId,
                num: item.announcementId,
                report: item.title?.trim() || "N/A",
                company: item.stockName || "Unknown", 
                date: item.announcementDate || "Unknown", 
                submitter: item.submitter || "Unknown", 
                votes: {
                    good: item.positiveVoteCount || 0,
                    bad: item.negativeVoteCount || 0,
                },
                comments: item.commentCount || 0,
            }));
            setFilteredDisclosureData(formattedData);
        
        } catch (error) {
            console.error("Failed to fetch initial disclosure data:", error);
        }
    };

    useEffect(() => {
        fetchInitialDisclosureData(1); 
    }, [searchQuery]);

    useEffect(() => {
        if (searchQuery.trim()) {
            // searchQuery 변경 시 필터 초기화 후 데이터 갱신
            setFilters((prevFilters) => ({
                ...prevFilters,
                keyword: searchQuery.trim(), // URL에서 가져온 query를 filters.keyword에 설정
            }));
            fetchDisclosureData(searchQuery.trim());
        }
    }, [searchQuery]);

    const handleSearchClick = () => {
        const keywordToUse = filters.keyword.trim() || searchQuery.trim(); 
        setFilters((prevFilters) => ({
            ...prevFilters,
            keyword: keywordToUse,
        }));

        fetchDisclosureData(keywordToUse);
    };

    const fetchDisclosureData = async (keyword) => {
        try {
            console.log("Current Filters: ", filters);
            
            const response = await axios.get(
                "http://43.203.154.25:8080/api/announcement/search",
                {
                    params: {
                        keyword: effectiveKeyword, 
                        sortBy: filters.sortBy, 
                        period: filters.period, 
                        marketType: filters.marketType, 
                        type: filters.type.length > 0 ? filters.type.join(",") : undefined, 
                        page: currentDisclosurePage - 1,
                        size: pageSize,
                    },
                }
            );
            
            const { announcementList = [] } = response.data?.data || {};

            const formattedData = announcementList.map((item) => ({
                id: item.announcementId,
                num: item.announcementId,
                report: item.title?.trim() || "N/A", 
                company: item.stockName || "Unknown", 
                date: item.announcementDate || "Unknown",
                submitter: item.submitter || "Unknown", 
                votes: {
                    good: item.positiveVoteCount || 0,
                    bad: item.negativeVoteCount || 0,
                },
                comments: item.commentCount || 0,
            }));
            setFilteredDisclosureData(formattedData);
        } catch (error) {
            console.error("Failed to fetch disclosure data:", error);
        }
    };
    
    useEffect(() => {
        fetchDisclosureData();
    }, [filters.keyword, currentDisclosurePage]);

    const handleFilterChange = (field, value) => {
        if (field === "keyword" && value.trim() === "") {
            setFilters((prevFilters) => ({
                ...prevFilters,
                keyword: searchQuery,
            }));
            return;
        }
        setFilters((prevFilters) => ({
          ...prevFilters,
          [field]: value,
        }));
    };

    const handleTypeToggle = (type) => {
        setFilters((prevFilters) => {
            const updatedTypes = prevFilters.type.includes(type)
                ? prevFilters.type.filter((t) => t !== type) 
                : [...prevFilters.type, type];
            return { ...prevFilters, type: updatedTypes };
        });
    };

    const resetFilters = () => {
        setFilters({
            keyword: searchQuery,
            sortBy: "latest",
            period: "",
            marketType: "",
            type: [],
        });
        setCurrentDisclosurePage(1);
        fetchDisclosureData(searchQuery.trim());
    };
      
    const disclosureHeaders = [
        { key: "num", label: `전체 ${filteredDisclosureData.length}개`, width: "10%"},
        { key: "company", label: "공시 대상 회사", width: "18%" },
        { key: "report", label: "보고서명", width: "25%" },
        { key: "submitter", label: "제출인", width: "18%" },
        { key: "date", label: "접수일자", width: "10%" },
        { key: "votes", label: "투표", width: "12%" },
        { key: "comments", label: "댓글수", width: "7%" },
    ];

    const openModal = () => setIsModalOpen(true); 
    const closeModal = () => setIsModalOpen(false); 
  
    const handleStartDateChange = (e) => {
      const newStartDate = e.target.value;
        setFilters((prev) => ({
            ...prev,
            startDate: newStartDate,
        }));
    };
  
    const handleEndDateChange = (e) => {
      const newEndDate = e.target.value;
        setFilters((prev) => ({
        ...prev,
        endDate: newEndDate,
        }));
    };

    return (
        <div>
            <div className="search-result-title">
                <h1 className="result-title">
                    <span style={{ color: "#0045B0", fontSize: "30px", fontWeight: "bold", marginLeft: "20px"}}>'{searchQuery}'</span>
                    <span style={{ color: "black", fontSize: "20px"}}> 검색결과</span>
                </h1>
            </div>

            <h2 className="list-title">종목명</h2>

            {filteredStockData.length > 0 ? (
                <>
                    <ListTables
                        type="stock"
                        data={filteredStockData}
                        headers={stockHeaders}
                    />
                    <div className="pagination-container">
                        <Pagination
                            count={Math.ceil(stockData.length / pageSize)}
                            page={currentStockPage}
                            onChange={handleStockPageChange}
                            color="primary"
                        />
                    </div>
                
                </>
            ) : (
                <div className="no-results-box">
                    <p className="no-results-text">종목 검색 결과가 없습니다.</p> 
                </div>
            )}
            
            
            <h2 className="list-title">공시</h2>
            {filteredDisclosureData.length > 0 ? (
            <>
            <div className="filters">
                <div className="sec">
                    <div className="sector1">
                        <div className="row">
                            <div className="filter-group search-group">
                                <label>공시대상 회사</label>
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="회사명 | 티커"
                                        value={filters.keyword === searchQuery ? "" : filters.keyword}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.trim() === "") {
                                                setFilters((prevFilters) => ({
                                                    ...prevFilters,
                                                    keyword: searchQuery,
                                                }));
                                            } else {
                                                setFilters((prevFilters) => ({
                                                    ...prevFilters,
                                                    keyword: value,
                                                }));
                                            }
                                        }}
                                    />
                                </div>                    
                            </div>
                        </div>
                    
                        <div className="row">
                            <div className="filter-group period-group">
                                <label>기간</label>
                                <div className="period-buttons">
                                    {["1개월", "6개월", "1년", "3년"].map((period) => (
                                    <button
                                        key={period}
                                        className={filters.period === period ? "active" : ""}
                                        onClick={() => handleFilterChange("period", period)}
                                        >
                                        {period}
                                    </button>
                                    ))}
                                    <button 
                                        className={filters.period === "지정" ? "active" : ""}
                                        onClick={() => {
                                            openModal();
                                            setFilters((prev) => ({ ...prev, period: "지정" })); // 지정 버튼 상태 설정
                                        }}
                                    
                                    >
                                        지정
                                    </button>
                                </div>
                            
                                {filters.startDate && filters.endDate && (
                                    <span className="selected-dates">
                                        {filters.startDate} ~ {filters.endDate}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="row">
                            <div className="filter-group market-group">
                                <label>시장</label>
                                <div className="market-buttons">
                                    {["전체", "코스피", "코스닥"].map((marketType) => (
                                    <button
                                        key={marketType}
                                        className={filters.marketType === marketType ? "active" : ""}
                                        onClick={() => handleFilterChange("marketType", marketType)}
                                        >
                                        {marketType}
                                    </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <section className="separator"></section>
                    
                <div className="filter-group type-group">
                <label>공시 유형</label>
                    <div className="type-buttons">
                        {[
                        "정기공시",
                        "주요사항보고",
                        "발행공시",
                        "지분공시",
                        "기타공시",
                        "외부감사관련",
                        "펀드공시",
                        "자산유동화",
                        "거래소공시",
                        "공정위공시",
                        ].map((type) => (
                            <button
                        key={type}
                        onClick={() => handleTypeToggle(type)}
                    >
                        {type}
                    </button>
                        ))}
                    </div>
                </div>
                
                <section className="separator"></section>

                <div className="sector2">
                    <div className="filter-actions">
                    <button className="fibut" onClick={handleSearchClick}>
                        검색
                    </button>
                    </div>

                    <div className="filter-actions">
                    <button className="fibut" onClick={resetFilters}>
                        초기화
                    </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
            <div className="modal-overlay">
            <div className="modal-content">
                <h3>날짜 선택</h3>
                <label>
                시작 날짜:
                <input
                    type="date"
                    value={filters.startDate || ""}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={handleStartDateChange}
                />
                </label>
                <label>
                종료 날짜:
                <input
                    type="date"
                    value={filters.endDate || ""}
                    min={filters.startDate || ""}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={handleEndDateChange}
                />
                </label>
                <div className="modal-actions">
                <button onClick={closeModal}>확인</button>
                </div>
            </div>
            </div>
            
        )}


            <ListTables
                type="disclosure"
                data={filteredDisclosureData}
                headers={disclosureHeaders}
            />
            <div className="pagination-container">
                <Pagination
                    count={Math.ceil(filteredDisclosureData.length / pageSize)}
                    page={currentDisclosurePage}
                    onChange={(e, page) => setCurrentDisclosurePage(page)}
                    color="primary"
                />
            </div>
            </>
        ) : (
            <div className="no-results-box">
                <p className="no-results-text">공시 검색 결과가 없습니다.</p> 
            </div>
        )}
        </div>
    );
};

export default SearchResultPage;

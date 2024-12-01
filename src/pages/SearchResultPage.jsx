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
    const pageSize = 10;
    const BASE_URL = import.meta.env.VITE_BACK_URL;

    //종목
    const [filteredStockData, setFilteredStockData] = useState([]);
    const [currentStockPage, setCurrentStockPage] = useState(1);
    const [allStockData, setAllStockData] = useState([]);

    const fetchStockData = async (page) => {
        try {
            setAllStockData([]);
            setFilteredStockData([]);

            const searchResponse = await axios.get(
                `${BASE_URL}/api/stock/search`,
              {
                params: {
                  keyword: searchQuery,
                },
              }
            );
            const searchData = searchResponse.data?.data || [];
<<<<<<< HEAD
            
=======
        
            const rankResponse = await axios.get(
              `${BASE_URL}/api/stockprice/rank`,
              {
                params: { sort_by: "amount" },
              }
            );
            const rankData = rankResponse.data?.data || {};
        
>>>>>>> c5a83cbaad01ae86329ba411e83bb2aa68c0587c
            const updatedData = await Promise.all(
                searchData.map(async (stockItem) => {
                    try {
                        const stockResponse = await axios.get(
                            `${BASE_URL}/api/stockprice/current/${stockItem.ticker}`
                        );
                        const stockData = stockResponse.data?.data || {};
    
                        return {
                            id: stockItem.id,
                            num: stockItem.id,
                            code: stockData.ticker || stockItem.ticker,
                            name: stockData.name || stockItem.companyName,
                            price: stockData.currentPrice
                                ? `${stockData.currentPrice}원`
                                : "0원",
                            changeRate: stockData.changeRate
                                ? `${(stockData.changeRate * 100).toFixed(2)}%`
                                : "0%",
                            transaction: stockData.accTradeVolume
                                ? `${stockData.accTradeVolume.toLocaleString()}원`
                                : "0원",
                        };
                    } catch (error) {
                        console.error(`Failed to fetch stock details for ticker ${stockItem.ticker}`, error);
                        return null;
                    }
                })
            );
    
            const validData = updatedData.filter((item) => item !== null);
    
            setAllStockData(validData);
            setFilteredStockData(validData.slice(0, pageSize));
            setCurrentStockPage(1);
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
        fetchStockData();
    }, [searchQuery]);

    const handleStockPageClick = (event, page) => {
        setCurrentStockPage(page);
    };

    useEffect(() => {
        const startIndex = (currentStockPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setFilteredStockData(allStockData.slice(startIndex, endIndex));
    }, [currentStockPage, allStockData]);

    //공시
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredDisclosureData, setFilteredDisclosureData] = useState([]);
    const [filters, setFilters] = useState({
        keyword: "",
        sortBy: "latest",
        period: "",
        marketType: "",
        type: [],
    });
    const [currentDisclosurePage, setCurrentDisclosurePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const fetchDisclosureData = async (page=1) => {
        try {
            const response = await axios.get(
                `${BASE_URL}/api/announcement/search`,
                {
                    params: {
                        keyword: searchQuery,
                        sortBy: "latest",
                        page: page - 1, // API 페이지는 0부터 시작
                        size: pageSize,
                    },
                }
            );

            const { announcementList = [], announcementCount } = response.data?.data || {};
            setTotalPages(announcementCount); 

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
        setCurrentDisclosurePage(1);
    }, [searchQuery]);

    useEffect(() => {
        fetchDisclosureData(currentDisclosurePage);
    }, [searchQuery, currentDisclosurePage]);

    const handleSearchClick = () => {
        const keywordToUse = filters.keyword.trim() || searchQuery.trim(); 
        setCurrentDisclosurePage(1);
        setFilters((prevFilters) => ({
            ...prevFilters,
            keyword: keywordToUse,
        }));

        fetchDisclosureData(1);
    };

    const handleDisclosurePageClick = (event, page) => {
        setCurrentDisclosurePage(page);
    };

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
                            count={Math.ceil(allStockData.length / pageSize)}
                            page={currentStockPage}
                            onChange={handleStockPageClick}
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
                    count={totalPages}
                    page={currentDisclosurePage}
                    onChange={handleDisclosurePageClick}
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
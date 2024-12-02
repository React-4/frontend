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
        
            const formattedData = searchData.map((stockItem) => ({
                id: stockItem.id,
                code: stockItem.ticker,
                name: stockItem.companyName,
                price: stockItem.currentPrice
                    ? `${Number(stockItem.currentPrice).toLocaleString()}원`
                    : "0원",
                changeRate: stockItem.changeRate
                    ? `${(stockItem.changeRate * 100).toFixed(2)}%`
                    : "0%",
                transaction: stockItem.volume
                    ? `${Number(stockItem.volume).toLocaleString()}주`
                    : "0주",
            }));
    
            const validData = formattedData.filter((item) =>
                Object.values(item).every((value) => value !== null)
            );
    
            setAllStockData(validData);
            setFilteredStockData(validData.slice(0, pageSize));
            setCurrentStockPage(1);
        } catch (error) {
            console.error("Failed to fetch stock data:", error);
        }
    };
      
    const stockHeaders = [
        { key: "id", label: `전체 ${allStockData.length}개`, width: "10%" },
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
    const [companyKeyword, setCompanyKeyword] = useState("");
    const [activeQuery, setActiveQuery] = useState(searchQuery);
    
    const fetchDisclosureData = async (page=1, keyword = searchQuery, filters={}) => {
        try {
            const response = await axios.get(
                `${BASE_URL}/api/announcement/search`,
                {
                    params: {
                        keyword,
                        sortBy: "latest",
                        period: filters.period || "",
                        marketType: filters.marketType || "",
                        type: filters.type || "",
                        page: page - 1, 
                        size: pageSize,
                    },
                }
            );

            const { announcementList = [], announcementCount } = response.data?.data || {};
            setTotalPages(announcementCount); 

            const formattedData = announcementList.map((item) => ({
                id: item.announcementId,
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

    // 데이터 초기 로드 및 검색어 검색어 변경 시 처리
    useEffect(() => {
        setCurrentDisclosurePage(1);
        fetchDisclosureData(1, searchQuery);
        setActiveQuery(searchQuery);
    }, [searchQuery]);

    const handleDisclosurePageClick = (event, page) => {
        setCurrentDisclosurePage(page);
    };

    //2차 필터링 검색 버튼 클릭
    const handleSearchClick = () => {
        const periodMap = { "1개월": "1m", "6개월": "6m", "1년": "1y", "3년": "3y" };
        const marketTypeMap = { "코스피": "KOSPI", "코스닥": "KOSDAQ" };

        const customPeriod =
        filters.startDate && filters.endDate
            ? `${filters.startDate}~${filters.endDate}`
            : "";

        const apiFilters = {
            period: filters.period === "지정" ? customPeriod : periodMap[filters.period] || "",            
            marketType: marketTypeMap[filters.marketType] || "",
            type: filters.type || "",
        }
         // 검색어가 없으면 searchQuery를 기반으로 요청
        const keyword = companyKeyword.trim() || searchQuery;
        fetchDisclosureData(1, keyword, apiFilters);; // 공시대상 검색
        setCurrentDisclosurePage(1); // 페이지 초기화
    };

     // 페이지가 변경될 때 데이터를 새로 가져옴
     useEffect(() => {
        fetchDisclosureData(currentDisclosurePage, activeQuery);
    }, [currentDisclosurePage, activeQuery]);

    const handleFilterChange = (field, value) => {
        if (field === "keyword" && value.trim() === "") {
            setFilters((prevFilters) => ({
                ...prevFilters,
                keyword: searchQuery,
            }));
            return;
        }
        setFilters((prevFilters) => {
            if (prevFilters[field] === value) {
                // 동일한 값 클릭 시 해제
                return { ...prevFilters, [field]: "" };
            }
            // 값 변경
            return { ...prevFilters, [field]: value };
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
        setCompanyKeyword(""); // 회사 검색어 초기화
        setActiveQuery(searchQuery); // 기본 검색어로 리셋
        setCurrentDisclosurePage(1);
        fetchDisclosureData(1, searchQuery);
    };
    
    const disclosureHeaders = [
        { key: "id", label: `전체 ${filteredDisclosureData.length}개`, width: "10%"},
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
                    <span
                        style={{
                            color: "#0045B0",
                            fontSize: "30px",
                            fontWeight: "bold",
                            marginLeft: "20px",
                        }}
                    >
                        '{searchQuery}'
                    </span>
                    <span style={{ color: "black", fontSize: "20px" }}> 검색결과</span>
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
    
            {/* 필터링 UI는 항상 표시 */}
            <div className="filters">
                <div className="sec">
                    <div className="sector1">
                        {/* 필터링 관련 UI */}
                        <div className="row">
                            <div className="filter-group search-group">
                                <label>공시대상 회사</label>
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="회사명 | 티커"
                                        value={companyKeyword}
                                        onChange={(e) => setCompanyKeyword(e.target.value)}
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
                                            setFilters((prev) => ({
                                                ...prev,
                                                period: "지정",
                                            }));
                                        }}
                                    >
                                        지정
                                    </button>
                                </div>
                                {filters.startDate && filters.endDate && (
                                    <span className="selected-dates">
                                        {filters.startDate}~{filters.endDate}
                                    </span>
                                )}
                            </div>
                        </div>
    
                        <div className="row">
                            <div className="filter-group market-group">
                                <label>시장</label>
                                <div className="market-buttons">
                                    {["코스피", "코스닥"].map((marketType) => (
                                        <button
                                            key={marketType}
                                            className={
                                                filters.marketType === marketType ? "active" : ""
                                            }
                                            onClick={() =>
                                                handleFilterChange("marketType", marketType)
                                            }
                                        >
                                            {marketType}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                <section className="separator1"></section>
    
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
                                className={filters.type === type ? "active" : ""}
                                onClick={() => handleFilterChange("type", type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
    
                <section className="separator2"></section>
    
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
    
            {/* 테이블은 조건부 렌더링 */}
            {filteredDisclosureData.length > 0 ? (
                <>
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
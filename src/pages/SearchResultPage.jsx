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
        period: "",
        market: "전체",
        types: [],
      });
    const pageSize = 10;
    const [currentStockPage, setCurrentStockPage] = useState(1);
    const [currentDisclosurePage, setCurrentDisclosurePage] = useState(1);
    
    const fetchStockData = async () => {
        try {
            const searchResponse = await axios.get(
                `http://43.203.154.25:8080/api/stock/search`,
                {
                  params: { keyword: searchQuery },
                }
            );
            const searchData = searchResponse.data?.data || [];

            const rankResponse = await axios.get(
                "http://43.203.154.25:8080/api/stockprice/rank",
                {
                  params: { sort_by: "change_rate_up" },
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

    const currentStockData = filteredStockData.slice(
        (currentStockPage - 1) * pageSize,
        currentStockPage * pageSize
    );



      const fetchDisclosureData = async () => {
        try {
          const response = await axios.get("http://43.203.154.25:8080/api/announcement", {
            params: { sortBy: "latest", page: 0, size: 1000 },
          });
    
          const { announcementList } = response.data?.data || {};
          const formattedData = announcementList.map((item) => ({
            id: item.announcementId,
            num: item.announcementId,
            company: item.stockName,
            report: item.title?.trim() || "N/A",
            submitter: item.submitter || "Unknown",
            date: item.announcementDate || "Unknown",
            votes: {
              good: item.positiveVoteCount || 0,
              bad: item.negativeVoteCount || 0,
            },
            comments: item.commentCount || 0,
          }));
    
          // 검색어로 필터링
          const filtered = formattedData.filter((item) =>
            item.company.includes(searchQuery)
          );
          setFilteredDisclosureData(filtered);
        } catch (error) {
          console.error("Failed to fetch disclosure data:", error);
        }
      };

      useEffect(() => {
        fetchStockData();
        fetchDisclosureData();
      }, [searchQuery]);

      const handleFilterChange = (field, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: prevFilters[field] === value ? "" : value, 
        }));
    };

    const handleTypeToggle = (type) => {
    setFilters((prevFilters) => {
        const currentTypes = prevFilters.type || [];
        const isTypeSelected = currentTypes.includes(type);
    
        return {
        ...prevFilters,
        type: isTypeSelected
            ? currentTypes.filter((t) => t !== type) // 이미 선택된 경우 제거
            : [...currentTypes, type], // 선택되지 않은 경우 추가
        };
    });
    };


    const disclosureHeaders = [
        { key: "num", label: `검색된 공시 ${filteredDisclosureData.length}개`, width: "10%"},
        { key: "company", label: "공시 대상 회사", width: "18%" },
        { key: "report", label: "보고서명", width: "25%" },
        { key: "submitter", label: "제출인", width: "18%" },
        { key: "date", label: "접수일자", width: "10%" },
        { key: "votes", label: "투표", width: "12%" },
        { key: "comments", label: "댓글수", width: "7%" },
      ];

      
    
      const currentDisclosureData = filteredDisclosureData.slice(
        (currentDisclosurePage - 1) * pageSize,
        currentDisclosurePage * pageSize
      );    
      
    const resetFilters = () => {
        setFilters({
            period: "",
            market: "전체",
            type: [],
        });
        fetchDisclosureData();
    };

    const searchFilters = () => {  
        const now = new Date();
        const filtered = filteredDisclosureData.filter((item) => {

        if (filters.company && !item.company.includes(filters.company)) {
            return false;
        }

        if (filters.period) {
            const daysAgo = {
            "1개월": 30,
            "6개월": 180,
            "1년": 365,
            "3년": 1095,
            }[filters.period];
            const itemDate = new Date(item.date);
            const cutoffDate = new Date(now);
            cutoffDate.setDate(now.getDate() - daysAgo);

            if (itemDate < cutoffDate) return false;
        }

        // 시장 필터 적용
        if (filters.market !== "전체") {
            filtered = filtered.filter((item) => item.market === filters.market);
        }
    
        // 공시 유형 필터 적용
        if (filters.types.length > 0) {
            filtered = filtered.filter((item) =>
            filters.types.some((type) => item.types.includes(type))
            );
        }

        return true;
        });

        setFilteredDisclosureData(filtered);
    };

    useEffect(() => {
        searchFilters();
      }, [filters]);
    
      const handlePageChange = (setPage) => (event, page) => {
        setPage(page);
      };

    const openModal = () => setIsModalOpen(true); 
    const closeModal = () => setIsModalOpen(false); 
  
    const handleStartDateChange = (e) => {
      const newStartDate = e.target.value;
      if (new Date(newStartDate) > new Date()) {
        alert("날짜 선택 오류: 시작 날짜는 오늘 이후로 설정할 수 없습니다!");
      } else {
        setFilters((prev) => ({
          ...prev,
          startDate: newStartDate,
        }));
      }
    };
  
    const handleEndDateChange = (e) => {
      const newEndDate = e.target.value;
      if (filters.startDate && new Date(newEndDate) < new Date(filters.startDate)) {
        alert("날짜 선택 오류: 종료 날짜가 시작 날짜보다 빠를 수 없습니다!");
      } else if (new Date(newEndDate) > new Date()) {
        alert("날짜 선택 오류: 종료 날짜는 오늘 이후로 설정할 수 없습니다!");
      } else {
        setFilters((prev) => ({
          ...prev,
          endDate: newEndDate,
        }));
      }
    };

    const handleInputChange = (event) => {
        const { value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            company: value,
        }));
    };

    const handleKeyDown = (event) => {
        if(event.key === "Enter") {
            searchFilters();
        }
    }

    return (
        <div>
            <div className="search-result-title">
                <h1 className="result-title">
                    <span style={{ color: "#0045B0", fontSize: "30px", fontWeight: "bold", marginLeft: "20px"}}>'{searchQuery}'</span>
                    <span style={{ color: "black", fontSize: "20px"}}> 검색결과</span>
                </h1>
            </div>

            <h2 className="list-title">종목명</h2>
            <ListTables
                type="stock"
                data={currentStockData}
                headers={stockHeaders}
            />
            <div className="pagination-container">
                <Pagination
                    count={Math.ceil(filteredStockData.length / pageSize)}
                    page={currentStockPage}
                    onChange={(event, page) => setCurrentStockPage(page)}
                    color="primary"
                />
            </div>
            

            <h2 className="list-title">공시</h2>
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
                                        value={filters.company}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
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
                                    {["코스피", "코스닥", "전체"].map((market) => (
                                    <button
                                        key={market}
                                        className={filters.market === market ? "active" : ""}
                                        onClick={() => handleFilterChange("market", market)}
                                        >
                                        {market}
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
                            className={filters.types.includes(type) ? "active" : ""}
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
                    <button className="fibut" onClick={searchFilters}>
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
                data={currentDisclosureData}
                headers={disclosureHeaders}
            />
            <Pagination
        count={Math.ceil(filteredDisclosureData.length / pageSize)}
        page={currentDisclosurePage}
        onChange={(event, page) => setCurrentDisclosurePage(page)}
        color="primary"
      />
        </div>
    );
};

export default SearchResultPage;

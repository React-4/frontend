import React, {useState} from "react";
import ListTables from "../components/common/ListTables";
import '../components/css/SearRes.css';

const SearchResultPage = () => {
    const stockData = Array.from({ length: 6 }, (_, index) => ({
        id: index + 1,
        num: index + 1,
        name: `삼성 ${index + 1}`,
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

    const sortedStockData = [...stockData].sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    const [filters, setFilters] = useState({
        period: "",
        market: "",
        type: "",
        startDate: "",
        endDate: "",
      });
      
      const handleFilterChange = (field, value) => {
        setFilters((prevFilters) => ({
          ...prevFilters,
          [field]: prevFilters[field] === value ? "" : value, // Toggle filter value
        }));
      };

    const resetFilters = () => {
        setFilters({
            period: "",
            market: "",
            type: "",
        });
        setFilteredData(disclosureData);
    };

    const searchFilters = () => {  
        const now = new Date();
        const filtered = disclosureData.filter((item) => {
        // Filter by period
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

        // Filter by market
        if (filters.market && filters.market !== "전체") {
            if (item.market !== filters.market) return false;
        }

        // Filter by type
        if (filters.type && item.type !== filters.type) {
            return false;
        }

        return true;
        });

        setFilteredData(filtered);
    };
    
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
      { key: "num", label: `검색된 공시 ${disclosureData.length}개`},
      { key: "company", label: "공시 대상 회사" },
      { key: "report", label: "보고서명" },
      { key: "submitter", label: "제출인" },
      { key: "date", label: "접수일자" },
      { key: "votes", label: "투표" },
      { key: "comments", label: "댓글수" },
    ];

    const [filteredData, setFilteredData] = useState(disclosureData);

    const sortedDisclosureData = [...filteredData].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    const handleInputChange = (event) => {
        const { value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            company: value,
        }));
    };

    return (
        <div>
            <div className="search-result-title">
                <h1 className="result-title
                ">
                    <span style={{ color: "#0045B0", fontSize: "30px", fontWeight: "bold", marginLeft: "20px"}}>'삼성'</span>
                    <span style={{ color: "black", fontSize: "20px"}}> 검색결과</span>
                </h1>
            </div>

            <h2 className="list-title">종목명</h2>
            <ListTables
                data={sortedStockData}
                headers={stockHeaders}
            />

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
                                />
                            </div>                    
                            </div>
                        </div>
                    
                        <div className="row">
                            <div className="filter-group period-group">
                            <label>기간</label>
                            <div className="period-buttons">
                                {["1개월", "6개월", "1년", "3년", "지정"].map((period) => (
                                <button
                                    key={period}
                                    className={filters.period === period ? "active" : ""}
                                    onClick={() => handleFilterChange("period", period)}
                                    >
                                    {period}
                                </button>
                                ))}
                                {filters.period === "지정" && (
                                    <div className="date-picker">
                                    <label>
                                        <input
                                        type="date"
                                        value={filters.startDate || ""}
                                        onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                                        />
                                    </label>
                                    <label>
                                        <input
                                        type="date"
                                        value={filters.endDate || ""}
                                        onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                                        />
                                    </label>
                                    </div>
                                )}

                                {/* 선택된 날짜 표시 */}
                                {filters.startDate && filters.endDate && filters.period === "지정" && (
                                    <div className="selected-dates">
                                    <span>
                                        선택된 날짜: {filters.startDate} ~ {filters.endDate}
                                    </span>
                                    </div>
                                )}

                            </div>
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
                    <section className="separator"></section>

                </div>
                

                

                {/* <div className="filter-group type-group">
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
                <section className="separator" role="search" aria-label="Search section"></section>

                <div className="sector1">
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
 */}

                
                

            </div>

            <ListTables
                data={sortedDisclosureData}
                headers={disclosureHeaders}
            />
        </div>
    );
};

export default SearchResultPage;

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
        period: "1개월",
        market: "코스닥",
        type: "정기공시",
      });
    
    const handleFilterChange = (field, value) => {
    setFilters({
        ...filters,
        [field]: value,
    });
    };

    const resetFilters = () => {
        setFilters({
            period: "",
            market: "",
            type: "",
        });
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

    const filteredData = disclosureData.filter((item) => {
        // 간단한 필터 로직 예시: 시장 필터링
        if (filters.market !== "전체" && item.company.includes(filters.market) === false) {
          return false;
        }
        // 다른 필터 조건 추가 가능
        return true;
    });
  
    const sortedDisclosureData = [...filteredData].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    return (
        <div>
            <div className="search-result-title">
                <h1 className="result-company1">
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
                <div className="filter-group">
                <label>기간</label>
                {["1개월", "6개월", "1년", "3년"].map((period) => (
                    <button
                    key={period}
                    className={filters.period === period ? "active" : ""}
                    onClick={() => handleFilterChange("period", period)}
                    >
                    {period}
                    </button>
                ))}
                </div>

                <div className="filter-group">
                <label>시장</label>
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

                <div className="filter-group">
                <label>공시 유형</label>
                {["정기공시", "주요사항보고", "발행공시", "자율공시"].map((type) => (
                    <button
                    key={type}
                    className={filters.type === type ? "active" : ""}
                    onClick={() => handleFilterChange("type", type)}
                    >
                    {type}
                    </button>
                ))}
                </div>

                <div className="filter-actions">
                <button className="reset" onClick={resetFilters}>
                    초기화
                </button>
                </div>
            </div>

            <ListTables
                data={sortedDisclosureData}
                headers={disclosureHeaders}
            />
        </div>
    );
};

export default SearchResultPage;

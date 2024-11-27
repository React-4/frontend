import React, {useState, useEffect} from "react";
import ListTables from "../components/common/ListTables";
import '../components/css/SearRes.css';
import { useParams } from "react-router-dom";
import stockJson from "../components/dummy/stock.json";

const SearchResultPage = () => {
    const {query} = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stockData, setStockData] = useState([]);
    const [disclosureData, setDisclosureData] = useState([]);
    const [filteredData, setFilteredData] = useState(disclosureData);
    const [filters, setFilters] = useState({
        period: "",
        market: "",
        type: "",
        startDate: "",
        endDate: "",
        company: "",
      });
    // const stockData = Array.from({ length: 6 }, (_, index) => ({
    //     id: index + 1,
    //     num: index + 1,
    //     name: `삼성 ${index + 1}`,
    //     code: `${Math.floor(Math.random() * (999999-100000+1))+100000}`.toString(),
    //     price: `${Math.floor(Math.random() * 9001)+1000} 억 원`,
    //     changeRate: `${(Math.random() * 10 - 5).toFixed(2)}%`,
    //     transaction: `${Math.floor(Math.random() * 19001)+1000} 억 원`,
    //   }));

    useEffect(() => {
        const stocks = Object.values(stockJson.data).map((stock, index) => ({
            id: index + 1,
            num: index + 1,
            name: `종목 ${index + 1}`, // JSON 데이터에 이름 정보가 없어서 추가(이건 테이블 조인하고)
            code: stock["종목코드"],
            price: `${stock["현재가"]} 원`,
            changeRate: `${stock["등락률"]}%`,
            transaction: `${stock["거래량"]} 주`,
        }));
        setStockData(stocks);

        const disclosures = disclosureJson.data.announcementList.map((announcement) => ({
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
        //const decodedQuery = decodeURIComponent(query.replace(/"/g, "")); // "검색어" 버튼으로 필터링
        // setFilteredData(
        //     disclosures.filter(
        //         (item) =>
        //         item.company.includes(decodedQuery) || item.report.includes(decodedQuery)
        //     )
        // );
  }, [query]);

    const stockHeaders = [
        { key: "num", label: `검색된 주식${stockData.length}개` },
        { key: "name", label: "종목명" },
        { key: "code", label: "종목코드" },
        { key: "price", label: "현재가" },
        { key: "changeRate", label: "등락률" },
        { key: "transaction", label: "거래량" },
    ];

    const disclosureHeaders = [
        { key: "num", label: `검색된 공시 ${disclosureData.length}개`},
        { key: "company", label: "공시 대상 회사" },
        { key: "report", label: "보고서명" },
        { key: "submitter", label: "제출인" },
        { key: "date", label: "접수일자" },
        { key: "votes", label: "투표" },
        { key: "comments", label: "댓글수" },
      ];

    const sortedStockData = [...stockData].sort((a, b) => { return a.name.localeCompare(b.name); });
    const sortedDisclosureData = [...filteredData].sort((a, b) => { return new Date(b.date) - new Date(a.date); });

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

        // if (filters.market && filters.market !== "전체") {
        //     if (item.market !== filters.market) return false;
        // }

        // if (filters.type && item.type !== filters.type) {
        //     return false;
        // }

        return true;
        });

        setFilteredData(filtered);
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
                <h1 className="result-title
                ">
                    <span style={{ color: "#0045B0", fontSize: "30px", fontWeight: "bold", marginLeft: "20px"}}>'삼성'</span>
                    <span style={{ color: "black", fontSize: "20px"}}> 검색결과</span>
                </h1>
            </div>

            <h2 className="list-title">종목명</h2>
            <ListTables
                type="stock"
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
                            className={filters.type.includes(type) ? "active" : ""}
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
                data={sortedDisclosureData}
                headers={disclosureHeaders}
            />
        </div>
    );
};

export default SearchResultPage;

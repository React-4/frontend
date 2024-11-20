import React, {useState} from "react";
import ListTables from "../components/common/ListTables";

const SearchResultPage = () => {
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
      { key: "num", label: `검색된 공시 ${disclosureData.length}개`},
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

    return (
        <div>
            <h2 className="list-title">공시</h2>
            <ListTables
                data={sortedDisclosureData}
                headers={disclosureHeaders}
            />
        </div>
    );
};

export default SearchResultPage;

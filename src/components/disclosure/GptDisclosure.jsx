import React from "react";

function parseSectionContent(content) {
  const result = [];
  const regex = /\d+\.\s\*\*(.*?)\*\*:\s(.*?)(?=\d+\.\s|\s*$)/gs; // 각 항목 추출 정규식

  let match;
  while ((match = regex.exec(content)) !== null) {
    const title = match[1].trim(); // **안의 텍스트
    const desc = match[2].trim(); // 그 뒤의 내용
    result.push({ title, desc }); // 객체로 배열에 추가
  }

  return result;
}

function convertToJSONWithDetails(text) {
  const sections = text
    .split("###")
    .map((section) => section.trim())
    .filter(Boolean); // '###'로 분리하고 빈 섹션 제거

  const result = {};
  sections.forEach((section) => {
    const lines = section
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const title = lines.shift(); // 첫 줄을 제목으로 사용
    const content = lines.join(" "); // 나머지를 내용으로 결합

    // 키를 영어로 매핑
    const titleMapping = {
      "공시 내용 요약": "summary",
      호재: "good",
      악재: "bad",
      "투자 의견": "opinion",
    };

    const englishKey = titleMapping[title] || title; // 매핑되지 않은 키는 그대로 사용

    if (englishKey === "good" || englishKey === "bad") {
      result[englishKey] = parseSectionContent(content); // 배열 형태로 변환
    } else {
      result[englishKey] = content;
    }
  });

  return result;
}

const disclosure = {
  title: "삼성전자 해외주권상장 안내",
  date: "2024.10.31",
  author: "홍길동",
  type: "공시종류",
  url: "",
  company: "삼성전자",
  summary: `
  ### 공시 내용 요약
  한성기업의 임원 한병수는 2024년 11월 20일 기준으로 특정증권 소유상황을 보고했으며, 현재 5,136주(0.08%)의 주식을 보유하고 있습니다. 이는 이전 보고서(2023년 10월 24일) 대비 5,036주 증가한 수치로, 2024년 6월 17일에 100주를 매도한 후 11월 14일과 15일에 각각 4,840주를 매수한 결과입니다.
  
  ### 호재
  1. **주식 매수**: 한병수가 대량의 주식을 매수한 것은 회사의 미래에 대한 긍정적인 전망을 나타낼 수 있으며, 이는 시장에 긍정적인 신호로 작용할 가능성이 있습니다.
  2. **주식 보유 증가**: 임원의 주식 보유량 증가가 회사에 대한 신뢰도를 높이며, 다른 투자자들에게도 긍정적인 영향을 미칠 수 있습니다.
  
  ### 악재
  1. **주식 매도**: 한병수가 100주를 매도한 부분은 다소 부정적인 신호로 해석될 수 있으며, 이는 임원이 일부 자금을 회수했음을 나타낼 수 있습니다.
  2. **상대적으로 낮은 보유 비율**: 현재 보유 주식이 0.08%로 상대적으로 낮은 비율이며, 이는 회사에 대한 신뢰가 완전히 확고하지 않을 수 있음을 시사합니다.
  
  ### 투자 의견
  한성기업에 대한 투자 의견은 **관망 또는 소량 매수**로 제안합니다. 임원의 대규모 주식 매수는 긍정적인 요소로 작용할 수 있으나, 매도 내역과 낮은 보유 비율은 주의가 필요합니다. 따라서, 추가적인 정보와 시장 반응을 지켜보면서 신중하게 접근하는 것이 바람직할 것입니다.
  `,
};

export default function GptDisclosure() {
  const summaryJSON = convertToJSONWithDetails(disclosure.summary);
  console.log(summaryJSON.good[0].title);
  return (
    <div className="flex flex-col items-center">
      <div className="w-9/12">
        <div className="font-bold text-3xl text-center">{disclosure.title}</div>
        <div className="flex flex-row gap-5 w-full justify-center mt-1">
          <div>제출자 : {disclosure.author}</div>
          <div>{disclosure.type}</div>
          <div className="">{disclosure.date}</div>
        </div>
        <div className="flex flex-row gap-3 w-full justify-end mt-3">
          <div className="bg-primary text-white w-24 h-7 rounded-lg text-center cursor-pointer">
            {disclosure.company}
          </div>
          <div className="bg-primary text-white w-32 h-7 rounded-lg text-center cursor-pointer">
            원본 공시 내용
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="font-bold text-xl">공시 내용 요약</div>
          <div>{summaryJSON.summary}</div>
          <div className="font-bold text-xl">호재</div>
          <div>
            {summaryJSON.good.map((item) => (
              <div className="mb-2" key={item.title}>
                <div className="font-semibold">{item.title}</div>
                <li>{item.desc}</li>
              </div>
            ))}
          </div>
          <div className="font-bold text-xl">악재</div>
          <div>
            {summaryJSON.bad.map((item) => (
              <div className="mb-2" key={item.title}>
                <div className="font-semibold">{item.title}</div>
                <li>{item.desc}</li>
              </div>
            ))}
          </div>
          <div className="font-bold text-xl">평가 의견</div>
          <div>{summaryJSON.opinion}</div>
        </div>
      </div>
    </div>
  );
}

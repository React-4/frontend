/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getGPTDisclosure } from "../../services/disclosureAPI";

function parseSectionContent(content) {
  const result = [];
  const regex =
    /(?:\d+\.\s\*\*(.*?)\*\*:\s(.*?)(?=\d+\.\s|\s*$))|(?:-\s(.*?)(?=\n|$))/gs;

  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match[1] && match[2]) {
      const title = match[1].trim(); // **안의 텍스트
      const desc = match[2].trim(); // 그 뒤의 내용
      result.push({ title, desc });
    } else if (match[3]) {
      // 제목 없이 설명만 있는 경우
      const desc = match[3].trim(); // - 뒤의 텍스트
      result.push({ desc });
    }
  }

  return result;
}

function convertToJSONWithDetails(text) {
  if (text === "test") return {}; // 방어 로직: 텍스트가 없는 경우 빈 객체 반환

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

export default function GptDisclosure({ announcement, company }) {
  const [summaryJSON, setSummaryJSON] = useState(null);

  useEffect(() => {
    if (
      announcement &&
      announcement.content &&
      announcement.content !== "test"
    ) {
      const json = convertToJSONWithDetails(announcement.content);
      setSummaryJSON(json);
    }
  }, [announcement]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-9/12">
        {/* 제목 */}
        <div className="font-bold text-3xl text-center">
          {announcement?.title}
        </div>

        <div className="flex flex-row gap-5 w-full justify-center mt-1">
          <div>제출자 : {announcement?.submitter || "정보 없음"}</div>
          <div>{announcement?.announcementDate || "날짜 정보 없음"}</div>
          <div className="border-primary border-2 px-5 h-7 rounded-lg text-center cursor-pointer">
            {announcement?.announcementType || "타입 정보 없음"}
          </div>
        </div>

        <div className="flex flex-row gap-3 w-full justify-end mt-3">
          <div className="bg-primary text-white px-5 h-7 rounded-lg text-center cursor-pointer">
            {company || "회사 정보 없음"}
          </div>
          <div
            className="bg-primary text-white w-32 h-7 rounded-lg text-center cursor-pointer"
            onClick={() => {
              window.open(announcement?.originalAnnouncementUrl);
            }}
          >
            원본 공시 내용
          </div>
        </div>

        <div className="flex flex-col gap-5 full">
          <div className="font-bold text-xl">공시 내용 요약</div>
          <div>{summaryJSON?.summary || "요약 정보가 없습니다."}</div>

          {/* 호재 */}
          <div className="font-bold text-xl">호재</div>
          {summaryJSON?.good?.length ? (
            <div>
              {summaryJSON.good.map((item, index) => (
                <div className="mb-2" key={item.title || index}>
                  {item.title && (
                    <div className="font-semibold">{item.title}</div>
                  )}
                  <li>{item.desc || "설명 없음"}</li>
                </div>
              ))}
            </div>
          ) : (
            <div>호재 정보가 없습니다.</div>
          )}

          {/* 악재 */}
          <div className="font-bold text-xl">악재</div>
          {summaryJSON?.bad?.length ? (
            <div>
              {summaryJSON.bad.map((item, index) => (
                <div className="mb-2" key={item.title || index}>
                  {item.title && (
                    <div className="font-semibold">{item.title}</div>
                  )}
                  <li>{item.desc || "설명 없음"}</li>
                </div>
              ))}
            </div>
          ) : (
            <div>악재 정보가 없습니다.</div>
          )}

          {/* 평가 의견 */}
          <div className="font-bold text-xl">평가 의견</div>
          <div>{summaryJSON?.opinion || "의견 정보가 없습니다."}</div>
        </div>
      </div>
    </div>
  );
}

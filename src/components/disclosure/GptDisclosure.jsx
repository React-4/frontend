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
  console.log("text", text);
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

export default function GptDisclosure({ announcement_id }) {
  console.log("annn", announcement_id);
  const [announcement, setAnnouncement] = useState([]);
  const [summaryJSON, setSummaryJSON] = useState();

  useEffect(() => {
    getGPTDisclosure(announcement_id).then((data) => setAnnouncement(data));
  }, [announcement_id]);

  useEffect(() => {
    console.log("sum", announcement);
    if (announcement && announcement.content) {
      const json = convertToJSONWithDetails(announcement.content);
      setSummaryJSON(json);
    }
  }, [announcement]);

  //const summaryJSON = convertToJSONWithDetails(announcement.content);

  //console.log(summaryJSON.good[0].title);
  console.log("sum", summaryJSON);

  return (
    <div className="flex flex-col items-center">
      <div className="w-9/12">
        <div className="font-bold text-3xl text-center">
          {announcement.title}
        </div>
        <div className="flex flex-row gap-5 w-full justify-center mt-1">
          <div>제출자 : {announcement.submitter}</div>
          <div>{announcement.type}</div>
          <div className="">{announcement.date}</div>
        </div>
        <div className="flex flex-row gap-3 w-full justify-end mt-3">
          <div className="bg-primary text-white w-24 h-7 rounded-lg text-center cursor-pointer">
            {announcement.company}
          </div>
          <div className="bg-primary text-white w-32 h-7 rounded-lg text-center cursor-pointer">
            원본 공시 내용
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="font-bold text-xl">공시 내용 요약</div>
          <div>{summaryJSON?.summary}</div>
          <div className="font-bold text-xl">호재</div>
          <div>
            {summaryJSON?.good.map((item) => (
              <div className="mb-2" key={item.title}>
                <div className="font-semibold">{item.title}</div>
                <li>{item.desc}</li>
              </div>
            ))}
          </div>
          <div className="font-bold text-xl">악재</div>
          <div>
            {summaryJSON?.bad.map((item) => (
              <div className="mb-2" key={item.title}>
                <div className="font-semibold">{item.title}</div>
                <li>{item.desc}</li>
              </div>
            ))}
          </div>
          <div className="font-bold text-xl">평가 의견</div>
          <div>{summaryJSON?.opinion}</div>
        </div>
      </div>
    </div>
  );
}

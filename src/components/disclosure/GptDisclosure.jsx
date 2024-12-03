import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGPTDisclosure } from "../../services/disclosureAPI";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  addFavoriteAnnouncementAPI,
  removeFavoriteAnnouncementAPI,
} from "../../services/stockAPI";

// ** 텍스트를 제거하고, 내부 텍스트만 남기는 함수
function parseSectionContent(content) {
  const result = [];
  const regex =
    /(?:\d+\.\s\*\*(.*?)\*\*:\s(.*?)(?=\d+\.\s|\s*$))|(?:-\s(.*?)(?=\n|$))/gs;

  let match;
  while ((match = regex.exec(content)) !== null) {
    console.log("Match found:", match[1], match[2], match[3]);
    if (match[1] && match[2]) {
      const title = match[1].trim(); // **안의 텍스트
      const desc = match[2].trim(); // 그 뒤의 내용
      result.push({ title, desc });
    } else if (match[3]) {
      // 제목 없이 설명만 있는 경우
      const desc = match[3].trim();
      result.push({ desc });
    }
  }

  return result;
}
function convertToJSONWithDetails(text) {
  if (text === "test") return {};
  const cleanText = text.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
    return p1;
  });

  const sections = cleanText
    .split("###")
    .map((section) => section.trim())
    .filter(Boolean);

  const result = {};
  sections.forEach((section) => {
    const lines = section
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const title = lines.shift();
    const content = lines.join(" ");

    // 키를 영어로 매핑
    const titleMapping = {
      "공시 내용 요약": "summary",
      호재: "good",
      악재: "bad",
      "투자 의견": "opinion",
    };

    const englishKey = titleMapping[title] || title;

    if (englishKey === "good" || englishKey === "bad") {
      result[englishKey] = parseSectionContent(content);
    } else {
      result[englishKey] = content;
    }
  });

  return result;
}

export default function GptDisclosure({ announcement, company, disclo_id }) {
  const navigate = useNavigate();
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

  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favoriteAnnouncementIds") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  const handleFavoriteToggle = async (id) => {
    try {
      if (favorites.includes(id)) {
        await removeFavoriteAnnouncementAPI(id);
        setFavorites((prev) => prev.filter((favId) => favId !== id));
      } else {
        await addFavoriteAnnouncementAPI(id);
        setFavorites((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-9/12">
        <div className="flex justify-center font-bold items-center text-3xl gap-5 text-center">
          {announcement?.title}

          <span
            className="heart"
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteToggle(disclo_id);
            }}
            style={{ cursor: "pointer" }}
          >
            {favorites.includes(disclo_id) ? (
              <FavoriteIcon style={{ color: "#F04452" }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </span>
        </div>

        <div className="flex flex-row gap-5 w-full justify-center mt-10 items-start">
          <div>제출자 : {announcement?.submitter || "정보 없음"}</div>
          <div>{announcement?.announcementDate || "날짜 정보 없음"}</div>
          <div className="border-primary border-2 px-5 h-7 rounded-lg text-center">
            {announcement?.announcementType || "타입 정보 없음"}
          </div>
        </div>

        <div className="flex flex-row gap-3 w-full justify-end mt-20">
          <div className="bg-primary text-white px-5 h-7 rounded-lg text-center">
            {company || "회사 정보 없음"}
          </div>
          <div
            className="bg-primary text-white w-52 h-7 rounded-lg text-center cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105"
            onClick={() => {
              window.open(announcement?.originalAnnouncementUrl);
            }}
          >
            원본 공시 내용 보러가기
          </div>
        </div>

        <div className="flex flex-col gap-5 full">
          <div className="font-bold text-xl">공시 내용 요약</div>
          <div>
            {summaryJSON?.summary.replaceAll("-", "") ||
              "요약 정보가 없습니다."}
          </div>

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
          <div className="font-bold text-xl">평가 의견</div>
          <div>
            {summaryJSON?.opinion.replaceAll("-", "") ||
              "의견 정보가 없습니다."}
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable react/prop-types */
import { useLogin } from "../../hooks/useLogin";
import { useState, useEffect } from "react";
import CommentList from "./CommentList";
import { getGPTDisclosure } from "../../services/disclosureAPI";
import { getCommentByAnnouncement } from "../../services/commentAPI";

// const commentData = [
//   {
//     username: "유저1",
//     date: "2024.10.12",
//     comment:
//       "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
//   },
//   {
//     username: "asdf",
//     date: "2024.10.12",
//     comment:
//       "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
//   },
//   {
//     username: "유저3",
//     date: "2024.10.12",
//     comment:
//       "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
//   },
//   {
//     username: "유저4",
//     date: "2024.10.12",
//     comment:
//       "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
//   },
//   {
//     username: "유저5",
//     date: "2024.10.12",
//     comment:
//       "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
//   },
//   {
//     username: "유저6",
//     date: "2024.10.12",
//     comment:
//       "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
//   },
//   {
//     username: "유저7",
//     date: "2024.10.12",
//     comment:
//       "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
//   },
//   {
//     username: "유저8",
//     date: "2024.10.12",
//     comment:
//       "일봉 기준 기울기 각도가 거진 80-90도가 되면패닉셀 및 바닥권이 머지 않았다는걸 의미 합니다.그래서 오늘 좀 매수질을 했습니다.",
//   },
// ];

export default function Comment({ announcement_id }) {
  const [announcement, setAnnouncement] = useState([]);
  const [summaryJSON, setSummaryJSON] = useState();
  const [good, setGood] = useState(0);
  const [bad, setBad] = useState(0);
  const { loggedIn } = useLogin();
  const [visibleComments, setVisibleComments] = useState(3);
  const [newComment, setNewComment] = useState("");
  const [commentData, setCommentData] = useState([]);

  useEffect(() => {
    getGPTDisclosure(announcement_id).then((data) => setAnnouncement(data));
    getCommentByAnnouncement(announcement_id).then((data) => {
      console.log("data", data);
      setCommentData(data);
    });
  }, [announcement_id]);
  // console.log("a", announcement.positiveVoteCount);
  useEffect(() => {
    setGood(announcement.positiveVoteCount);
    setGood(announcement.negativeVoteCount);
  }, [announcement]);

  const handleShowMore = () => {
    setVisibleComments((prev) => prev + 3);
  };
  console.log("comment", commentData);

  return (
    <div className="flex flex-col items-center">
      {/* 투표 */}
      <div className="flex flex-row gap-4 w-full justify-end">
        <div
          className="bg-good text-good-1 w-20 h-8 rounded-lg text-center py-1 cursor-pointer"
          onClick={() => setGood(good + 1)}
        >
          호재 {good}
        </div>
        <div
          className="bg-bad text-bad-1 w-20 h-8 rounded-lg text-center py-1 cursor-pointer"
          onClick={() => setBad(bad + 1)}
        >
          악재 {bad}
        </div>
      </div>

      {/* 댓글창 */}

      {loggedIn && (
        <div className="flex flex-row justify-between my-4 w-full ">
          <div className="flex flex-col">
            <div className="rounded-full w-10 h-10 bg-red-400 text-white text-center p-1">
              {loggedIn.slice(0, 2)}
            </div>
            <div>{loggedIn}</div>
          </div>
          <div className="relative inline-block w-94% ">
            <textarea
              className="bg-primary-1 w-full h-24 p-4 rounded-lg"
              placeholder="의견을 남겨주세요"
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="absolute bottom-4 right-4 h-8 w-16 bg-primary text-white rounded-lg"
            >
              등록
            </button>
          </div>
        </div>
      )}
      <CommentList commentData={commentData} />
    </div>
  );
}

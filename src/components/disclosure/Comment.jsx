/* eslint-disable react/prop-types */
import { useLogin } from "../../hooks/useLogin";
import { useState, useEffect } from "react";
import CommentList from "./CommentList";
import { getGPTDisclosure } from "../../services/disclosureAPI";
import {
  getCommentByAnnouncement,
  postComment,
} from "../../services/commentAPI";

export default function Comment({ announcement, announcement_id }) {
  const [page, setPage] = useState(0);
  const [good, setGood] = useState(announcement.positiveVoteCount);
  const [bad, setBad] = useState(announcement.negativeVoteCount);
  const [isEnd, setIsEnd] = useState(false);
  const { loggedIn, profileColor } = useLogin();
  const [visibleComments, setVisibleComments] = useState(3);
  const [newComment, setNewComment] = useState("");
  const [commentData, setCommentData] = useState([]);

  useEffect(() => {
    setGood(announcement.positiveVoteCount);
    setGood(announcement.negativeVoteCount);
  }, [announcement]);
  const nickname = localStorage.getItem("nickname");

  console.log("comment", commentData);
  useEffect(() => {
    getCommentByAnnouncement(announcement_id, 0, 6).then((data) =>
      setCommentData(data)
    );
  }, []);
  const handlePostComment = () => {
    postComment(announcement_id, newComment);
  };

  useEffect(() => {
    console.log("page", page);
    if (page > 1) {
      getCommentByAnnouncement(announcement_id, page, 3).then((data) => {
        setCommentData((prev) => [...prev, ...data]);
        if (data.length == 3) {
          setIsEnd(true);
        }
      });
    }
  }, [page, announcement_id]);

  const colorClasses = [
    "bg-profile",
    "bg-profile-0",
    "bg-profile-1",
    "bg-profile-2",
    "bg-profile-3",
    "bg-profile-4",
    "bg-profile-5",
    "bg-profile-6",
    "bg-profile-7",
    "bg-profile-8",
    "bg-profile-9",
  ];

  const colorClass = colorClasses[profileColor];

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
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full w-10 h-10 ${colorClass} text-white text-center p-1 flex flex-col items-center justify-center`}
            >
              {nickname.slice(0, 2)}
            </div>
            <div>{nickname}</div>
          </div>
          <div className="relative inline-block w-94% ">
            <textarea
              className="bg-primary-1 w-full h-24 p-4 rounded-lg"
              placeholder="의견을 남겨주세요"
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
            ></textarea>
            <button
              type="submit"
              className="absolute bottom-4 right-4 h-8 w-16 bg-primary text-white rounded-lg"
              onClick={handlePostComment}
            >
              등록
            </button>
          </div>
        </div>
      )}
      <CommentList
        commentData={commentData}
        page={page}
        setPage={setPage}
        isEnd={isEnd}
      />
    </div>
  );
}

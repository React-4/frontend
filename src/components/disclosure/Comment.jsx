/* eslint-disable react/prop-types */
import { useLogin } from "../../hooks/useLogin";
import { useState, useEffect } from "react";
import CommentList from "./CommentList";
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
  const [newComment, setNewComment] = useState("");
  const [localComment, setLocalComment] = useState([]);
  const nickname = localStorage.getItem("nickname");
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

  // 초기 댓글 가져오기
  useEffect(() => {
    getCommentByAnnouncement(announcement_id, 0, 6).then((data) => {
      setLocalComment(data);
    });
  }, [announcement_id]);

  // 댓글 등록
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await postComment(announcement_id, newComment);
      console.log("rr", response);
      const newCommentData = {
        commentId: response.commentId,
        username: nickname,
        content: newComment,
        createdAt: new Date().toISOString(),
        userProfileColor: profileColor,
      };
      setLocalComment((prev) => [newCommentData, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    }
  };

  const refreshComments = async () => {
    try {
      const data = await getCommentByAnnouncement(announcement_id, 0, 6);
      setLocalComment(data);
    } catch (error) {
      console.error("댓글 리스트 새로고침 실패:", error);
    }
  };

  useEffect(() => {
    if (page > 0) {
      getCommentByAnnouncement(announcement_id, page, 3).then((data) => {
        if (data.length > 0) {
          setLocalComment((prev) => [...prev, ...data]);
        }
        if (data.length < 3) {
          setIsEnd(true);
        }
      });
    }
  }, [page, announcement_id]);

  return (
    <div className="flex flex-col items-center">
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
        announcementId={announcement_id}
        commentData={localComment}
        page={page}
        setPage={setPage}
        isEnd={isEnd}
        refreshComments={refreshComments} // 새로고침 콜백 전달
      />
    </div>
  );
}

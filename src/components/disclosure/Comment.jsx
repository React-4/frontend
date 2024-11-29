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
  const [localComment, setLocalComment] = useState([]); // 최종적으로 CommentList에 전달할 배열
  const nickname = localStorage.getItem("nickname");
  const [comment, setComment] = useState([]);

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

  // 초기값으로 댓글 데이터를 로드
  useEffect(() => {
    getCommentByAnnouncement(announcement_id, 0, 6).then((data) => {
      setLocalComment(data); // 초기값 설정
    });
  }, [announcement_id]);

  // 새로운 댓글 등록 처리
  const handlePostComment = async () => {
    if (!newComment.trim()) return; // 공백 방지
    try {
      const response = await postComment(announcement_id, newComment);
      const newCommentData = {
        // id: response.id, // 서버에서 반환한 고유 ID
        username: nickname,
        content: newComment,
        createdAt: new Date().toISOString(), // 현재 시간
        userProfileColor: profileColor,
      };

      // 기존 댓글 데이터에 새 댓글 추가
      setLocalComment((prev) => [newCommentData, ...prev]); // 최신 댓글을 맨 앞에 추가
      setNewComment(""); // 입력창 초기화
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    }
  };

  useEffect(() => {
    if (page > 0) {
      getCommentByAnnouncement(announcement_id, page, 3).then((data) => {
        if (data.length > 0) {
          setComment((prev) => [...prev, ...data]);
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

      {/* 댓글 리스트 */}
      <CommentList
        commentData={localComment} // 수정된 comment 상태 전달
        page={page}
        setPage={setPage}
        isEnd={isEnd}
      />
    </div>
  );
}

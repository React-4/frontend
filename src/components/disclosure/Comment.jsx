/* eslint-disable react/prop-types */
import { useLogin } from "../../hooks/useLogin";
import { useState, useEffect } from "react";
import CommentList from "./CommentList";
import {
  getCommentByAnnouncement,
  postComment,
} from "../../services/commentAPI";
import { postVote, deleteVote } from "../../services/voteAPI";

export default function Comment({ announcement, announcement_id }) {
  const [page, setPage] = useState(0);
  const [good, setGood] = useState(0);
  const [bad, setBad] = useState(0);
  const [voted, setVoted] = useState(false); // 투표 상태
  const [voteType, setVoteType] = useState(null); // 투표한 종류 (POSITIVE 또는 NEGATIVE)
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

  // 페이지가 로드될 때 로컬 스토리지에서 이전 투표 정보를 불러오기
  useEffect(() => {
    const savedVote = JSON.parse(
      localStorage.getItem(`vote_${announcement_id}`)
    );
    if (savedVote) {
      setVoted(true);
      setVoteType(savedVote.voteType);
    }
  }, [announcement_id]);

  useEffect(() => {
    setGood(announcement.positiveVoteCount);
    setBad(announcement.negativeVoteCount);
  }, [announcement.negativeVoteCount, announcement.positiveVoteCount]);

  const handleVote = async (e) => {
    if (loggedIn === true) {
      // 투표한 상태일 경우
      if (voted) {
        const confirmCancel = window.confirm(
          "이미 투표한 내용이 있습니다. 투표를 취소하시겠습니까?"
        );
        if (confirmCancel) {
          try {
            const res = await deleteVote(announcement_id); // 투표 취소 요청
            if (res.status === 200) {
              localStorage.removeItem(`vote_${announcement_id}`);
              if (voteType === "POSITIVE") {
                setGood((prev) => prev - 1);
              } else if (voteType === "NEGATIVE") {
                setBad((prev) => prev - 1);
              }
              setVoted(false);
              setVoteType(null);
            }
          } catch (err) {
            alert("투표 취소 실패: " + err.message);
          }
        }
      } else {
        if (e.target.innerHTML.slice(0, 2) === "호재") {
          try {
            const res = await postVote(announcement_id, "POSITIVE");
            if (res.status === 201) {
              setGood((prev) => prev + 1);
              setVoted(true);
              setVoteType("POSITIVE");
              // 로컬 스토리지에 투표 정보 저장
              localStorage.setItem(
                `vote_${announcement_id}`,
                JSON.stringify({ voteType: "POSITIVE" })
              );
            }
          } catch (err) {
            alert("호재 투표 실패: " + err.message);
          }
        } else {
          try {
            const res = await postVote(announcement_id, "NEGATIVE");
            if (res.status === 201) {
              setBad((prev) => prev + 1);
              setVoted(true);
              setVoteType("NEGATIVE");
              // 로컬 스토리지에 투표 정보 저장
              localStorage.setItem(
                `vote_${announcement_id}`,
                JSON.stringify({ voteType: "NEGATIVE" })
              );
            }
          } catch (err) {
            alert("악재 투표 실패: " + err.message);
          }
        }
      }
    } else {
      alert("로그인 후 투표할 수 있어요");
    }
  };

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
      const newCommentData = {
        commentId: response.data,
        username: nickname,
        content: newComment,
        createdAt: new Date().toISOString(),
        userProfileColor: profileColor,
      };
      // setLocalComment((prev) => [newCommentData, ...prev]);
      setNewComment("");
      refreshComments();
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
          className={`w-20 h-8 rounded-lg text-center py-1 cursor-pointer ${
            voted && voteType === "NEGATIVE"
              ? "bg-primary-2"
              : "bg-good text-good-1"
          } ${
            voted && voteType !== "POSITIVE"
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={(e) => handleVote(e)}
          disabled={voted && voteType !== "POSITIVE"}
        >
          호재 {good}
        </div>
        <div
          className={`w-20 h-8 rounded-lg text-center py-1 cursor-pointer ${
            voted && voteType === "POSITIVE"
              ? "bg-primary-2"
              : "bg-bad text-bad-1"
          } ${
            voted && voteType !== "NEGATIVE"
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={(e) => handleVote(e)}
          disabled={voted && voteType !== "NEGATIVE"}
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
        refreshComments={refreshComments}
      />
    </div>
  );
}

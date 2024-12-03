/* eslint-disable react/prop-types */
import { useLogin } from "../../hooks/useLogin";
import { useState, useEffect } from "react";
import CommentList from "./CommentList";
import {
  getCommentByAnnouncement,
  postComment,
} from "../../services/commentAPI";
import { postVote, deleteVote } from "../../services/voteAPI";
import { CancleVoteModal, LoginModal } from "../common/Modal";
import ScrollToTopButton from "../common/ScrollToTopButton";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingVoteType, setPendingVoteType] = useState(null);

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
      const newVoteType =
        e.target.innerHTML.slice(0, 2) === "호재" ? "POSITIVE" : "NEGATIVE";
      if (voted) {
        // 투표한 상태일 경우
        setPendingVoteType(newVoteType); // 취소할 투표 타입 저장
        setIsModalOpen(true); // 모달 열기
      } else {
        // 투표하지 않은 상태에서 새로운 투표 진행

        await submitVote(newVoteType);
      }
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const submitVote = async (voteType) => {
    try {
      const res = await postVote(announcement_id, voteType);
      if (res.status === 201) {
        if (voteType === "POSITIVE") {
          setGood((prev) => prev + 1);
        } else {
          setBad((prev) => prev + 1);
        }
        setVoted(true);
        setVoteType(voteType);
        localStorage.setItem(
          `vote_${announcement_id}`,
          JSON.stringify({ voteType })
        );
      }
    } catch (err) {
      alert(
        `${voteType === "POSITIVE" ? "호재" : "악재"} 투표 실패: ${err.message}`
      );
    }
  };

  const handleConfirmCancel = async () => {
    try {
      const res = await deleteVote(announcement_id);
      if (res.status === 200) {
        localStorage.removeItem(`vote_${announcement_id}`);
        if (pendingVoteType === "POSITIVE") {
          setGood((prev) => prev - 1);
        } else if (pendingVoteType === "NEGATIVE") {
          setBad((prev) => prev - 1);
        }
        // 다른 투표 타입으로 변경
        if (pendingVoteType !== voteType) {
          await submitVote(pendingVoteType);
          if (pendingVoteType === "POSITIVE") {
            setBad((prev) => prev - 1);
            setGood((prev) => prev + 1);
            setVoteType("POSITIVE");
          } else if (pendingVoteType === "NEGATIVE") {
            setGood((prev) => prev - 1);
            setBad((prev) => prev + 1);
            setVoteType("NEGATIVE");
          }
        } else {
          setVoted(false);
          setVoteType(null);
        }
        setPendingVoteType(null);
      }
    } catch (err) {
      alert("투표 취소 실패: " + err.message);
    } finally {
      setIsModalOpen(false); // 모달 닫기
      setPendingVoteType(null); // 상태 초기화
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
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
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-4 w-full justify-center mb-20">
          <div
            className={`flex items-center justify-center w-32 h-12 rounded-lg text-center py-1 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 ${
              voted && voteType === "NEGATIVE"
                ? "bg-primary-2"
                : "bg-green-500 text-white"
            } ${
              voted && voteType !== "POSITIVE"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={(e) => handleVote(e)}
            disabled={voted && voteType !== "POSITIVE"}
          >
            호재 ☀️ {good}
          </div>
          <div
            className={`flex items-center justify-center w-32 h-12 rounded-lg text-center py-1 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 ${
              voted && voteType === "POSITIVE"
                ? "bg-primary-2"
                : "bg-red-500 text-white"
            } ${
              voted && voteType !== "NEGATIVE"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={(e) => handleVote(e)}
            disabled={voted && voteType !== "NEGATIVE"}
          >
            악재 🌧️ {bad}
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
                className="absolute bottom-4 right-4 h-8 w-16 bg-primary text-white rounded-lg hover:opacity-70"
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
      <ScrollToTopButton />

      <CancleVoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
        message="이미 투표한 내용이 있습니다. 투표를 취소하시겠습니까?"
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        message="로그인 후 투표할 수 있어요"
      />
    </>
  );
}

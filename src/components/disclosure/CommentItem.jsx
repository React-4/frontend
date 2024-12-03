/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { patchComment, deleteComment } from "../../services/commentAPI";

export function formatDate(inputDate) {
  const now = new Date();
  const date = new Date(inputDate);

  const diffMinutes = Math.floor((now - date) / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const isSameDay =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  if (diffMinutes < 60) {
    if (diffMinutes < 0) return "0분 전";
    return `${diffMinutes}분 전`;
  } else if (isSameDay) {
    return `${diffHours}시간 전`;
  } else {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  }
}

export default function CommentItem({
  commentId,
  username,
  comment,
  date,
  userProfileColor,
  refreshComments,
}) {
  const [isOverflow, setIsOverflow] = useState(false);
  const commentRef = useRef();
  const { nickname } = useLogin();

  useEffect(() => {
    if (commentRef.current) {
      const isContentOverflowing =
        commentRef.current.scrollHeight > commentRef.current.offsetHeight;
      setIsOverflow(isContentOverflowing);
    }
  }, []);

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

  const colorClass = colorClasses[userProfileColor];

  const [editedComment, setEditedComment] = useState(comment);
  const [isEditing, setIsEditing] = useState(false);

  const handleRemove = async () => {
    try {
      await deleteComment(commentId);
      refreshComments();
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await patchComment(commentId, editedComment);
      setIsEditing(false);
      refreshComments();
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
    }
  };

  return (
    <div className="flex flex-row justify-between mt-6 w-full items-center">
      <div
        className={`rounded-full w-10 h-10 text-white p-1 ${colorClass} flex flex-col items-center justify-center`}
      >
        {username.slice(0, 2)}
      </div>
      <div className="w-full flex flex-col px-4">
        <div className="flex flex-row items-center">
          {username}
          <span className="ml-3 text-xs text-primary-2">
            {formatDate(date)}
          </span>

          {nickname === username && !isEditing && (
            <div className="ml-4 flex flex-row h-2 items-center gap-1 py-5 text-primary-2">
              <EditOutlinedIcon
                sx={{
                  width: "1.2rem",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.2)",
                    transition: "transform 0.2s ease",
                  },
                }}
                onClick={() => {
                  setIsEditing(true);
                }}
              />

              <CloseIcon
                sx={{
                  width: "1.4rem",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.2)",
                    transition: "transform 0.2s ease",
                  },
                }}
                onClick={handleRemove}
              />
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="relative inline-block">
            <textarea
              className="bg-primary-1 w-full h-24 p-4 rounded-lg"
              placeholder="의견을 남겨주세요"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="absolute bottom-4 right-4 h-8 w-16 bg-primary text-white rounded-lg hover:opacity-70"
              onClick={handleEdit}
            >
              등록
            </button>
          </div>
        ) : (
          <div
            className="w-full max-h-12 rounded-lg overflow-hidden"
            ref={commentRef}
          >
            {comment}
          </div>
        )}

        {isOverflow && (
          <div className="text-blue-500 cursor-pointer my-2 text-sm">
            더보기 ...
          </div>
        )}
      </div>
    </div>
  );
}

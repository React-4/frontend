/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import edit from "/img/edit.png";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

function formatDate(inputDate) {
  console.log("ii", inputDate);
  const now = new Date();
  const date = new Date(inputDate);

  const diffMinutes = Math.floor((now - date) / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const isSameDay =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  if (diffMinutes < 60) {
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
  username,
  comment,
  date,
  userProfileColor,
}) {
  const [isOverflow, setIsOverflow] = useState(false);
  const commentRef = useRef();
  const { loggedIn } = useLogin();

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

  const handleRemove = () => {
    // API 삭제 요청
  };

  const handleEdit = () => {
    // API 수정 요청
  };

  return (
    <div className="flex flex-row justify-between mt-6 w-full">
      <div
        className={`rounded-full w-10 h-10 text-white p-1 ${colorClass} flex flex-col items-center justify-center`}
      >
        {username.slice(0, 2)}
      </div>
      <div className="w-full flex flex-col px-4">
        <div>
          {username}
          <span className="ml-3 text-xs text-primary-2">
            {formatDate(date)}
          </span>
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
              className="absolute bottom-4 right-4 h-8 w-16 bg-primary text-white rounded-lg "
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

        {loggedIn === username && !isEditing && (
          <div className="flex flex-row h-3 items-center gap-3 p-1">
            <img
              src={edit}
              className="w-3 cursor-pointer"
              onClick={() => setIsEditing(true)}
            />

            <CloseIcon
              sx={{ width: "1.2rem", cursor: "pointer" }}
              onClick={handleRemove}
            />
          </div>
        )}
      </div>
    </div>
  );
}

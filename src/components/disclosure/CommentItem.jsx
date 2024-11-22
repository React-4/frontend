/* eslint-disable react/prop-types */
import React from "react";
import { useRef, useEffect, useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import edit from "../../assets/Edit.png";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

export default function CommentItem({ username, comment, date }) {
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

  const colorcode = "bg-profile-" + String(Math.floor(Math.random() * 10));

  const [editedComment, setEditedComment] = useState(comment);
  const [isEditing, setIsEditing] = useState(false);
  const handleRemove = () => {
    // api 삭제 요청
  };
  const handleEdit = () => {};
  return (
    <div className="flex flex-row justify-between mt-6">
      <div
        className={`rounded-full w-10 h-10 text-white text-center p-1 ${colorcode}`}
      >
        {username.slice(0, 2)}
      </div>
      <div className="w-full flex flex-col px-4">
        <div>
          {username}
          <span className="ml-3 text-xs text-primary-2">{date}</span>{" "}
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
        {loggedIn === username && isEditing === false && (
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

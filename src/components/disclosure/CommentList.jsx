/* eslint-disable react/prop-types */
import { useState } from "react";
import CommentItem from "./CommentItem";

export default function CommentList({ commentData }) {
  const [visibleComments, setVisibleComments] = useState(3);
  const handleShowMore = () => {
    setVisibleComments((prev) => prev + 3);
  };

  return (
    <div className="flex flex-col items-center ">
      {/* 댓글 리스트 */}
      {commentData.slice(0, visibleComments).map((data) => (
        <CommentItem
          key={data.username}
          username={data.username}
          comment={data.comment}
          date={data.date}
        />
      ))}

      {visibleComments < commentData.length && (
        <button
          onClick={handleShowMore}
          className="mt-4 text-primary-4 hover:underline"
        >
          더보기
        </button>
      )}
    </div>
  );
}

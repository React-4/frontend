/* eslint-disable react/prop-types */
import { useState } from "react";
import CommentItem from "./CommentItem";

export default function CommentList({
  commentData,
  page,
  setPage,
  isEnd,
  refreshComments,
}) {
  const [visibleComments, setVisibleComments] = useState(3);
  const handleShowMore = () => {
    setPage((prev) => prev + 1);
    setVisibleComments((prev) => prev + 3);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* 댓글 리스트 */}
      {commentData.slice(0, visibleComments).map((data) => (
        <CommentItem
          key={data.commentId}
          commentId={data.commentId}
          username={data.username}
          comment={data.content}
          date={data.createdAt}
          userProfileColor={data.userProfileColor}
          refreshComments={refreshComments}
        />
      ))}

      {!isEnd && commentData.length > 3 && (
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

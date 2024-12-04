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

  //댓글 없는 경우
  if (!Array.isArray(commentData) || commentData.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-55 rounded-lg my-10">
        <span className="text-xl font-medium text-primary-2 text-center">
          공시 댓글이 존재하지 않습니다.
        </span>
      </div>
    );
  }

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

      {!isEnd && commentData.length > 3 && setPage && (
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

/* eslint-disable react/prop-types */
import React from "react";
import { useRef, useEffect, useState } from "react";
export default function CommentItem({ username, comment }) {
  const [isOverflow, setIsOverflow] = useState(false);
  const commentRef = useRef();
  useEffect(() => {
    if (commentRef.current) {
      const isContentOverflowing =
        commentRef.current.scrollHeight > commentRef.current.offsetHeight;
      setIsOverflow(isContentOverflowing);
    }
  }, []);

  const colorcode = Math.floor(Math.random() * 10);

  return (
    <div className="flex flex-row justify-between w-94% mt-6">
      <div
        className={`rounded-full w-10 h-10 bg-profile-${colorcode} text-white text-center p-1`}
      >
        {username.slice(0, 2)}
      </div>
      <div className="w-full flex flex-col px-4">
        <div>{username}</div>
        <div
          className="w-full max-h-12 rounded-lg overflow-hidden"
          ref={commentRef}
        >
          {comment}
        </div>{" "}
        {isOverflow && (
          <div className="text-blue-500 cursor-pointer my-2 text-sm">
            더보기 ...
          </div>
        )}
      </div>
    </div>
  );
}

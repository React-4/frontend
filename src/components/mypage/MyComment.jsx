/* eslint-disable react/prop-types */
import React from "react";
import { useState, useRef, useEffect } from "react";

export default function MyComment({ company, title, date, comment }) {
  const [isOverflow, setIsOverflow] = useState(false);
  const commentRef = useRef();
  useEffect(() => {
    if (commentRef.current) {
      const isContentOverflowing =
        commentRef.current.scrollHeight > commentRef.current.offsetHeight;
      setIsOverflow(isContentOverflowing);
    }
  }, [comment]);
  return (
    <div className="w-2/3">
      <div className="flex flex-row justify-between text-primary-2 font-bold">
        <div>
          {company} / {title}
        </div>
        <div>{date}</div>
      </div>
      <div
        ref={commentRef}
        className="max-h-18 overflow-hidden mt-2 cursor-pointer"
      >
        {comment}
      </div>
      {isOverflow && (
        <div className="text-blue-500 cursor-pointer my-2">더보기 ...</div>
      )}
      <hr className="my-5"></hr>
    </div>
  );
}

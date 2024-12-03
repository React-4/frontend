/* eslint-disable react/prop-types */
import React, { forwardRef, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyComment = forwardRef(
  ({ company, stockId, announcementId, title, date, comment }, ref) => {
    const [isOverflow, setIsOverflow] = useState(false);
    const commentRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
      if (commentRef.current) {
        const isContentOverflowing =
          commentRef.current.scrollHeight > commentRef.current.offsetHeight;
        setIsOverflow(isContentOverflowing);
      }
    }, [comment]);

    return (
      <div className="w-2/3" ref={ref}>
        <div className="flex flex-row justify-between text-primary-2 font-bold">
          <div className="felx flex-column">
            <button
              className="hover:underline hover:text-blue-500"
              onClick={() =>
                navigate(`/disclosure/${announcementId}`, {
                  state: {
                    data: [
                      {
                        announcementId,
                        company,
                        title,
                        date,
                      },
                    ],
                  },
                })
              }
            >
              {company} / {title}
            </button>
          </div>
          <div>{date.slice(0, 10)}</div>
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
);

MyComment.displayName = "MyComment";

export default MyComment;

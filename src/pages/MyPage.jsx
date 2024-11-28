import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/api";
import EditInfo from "./../components/mypage/EditInfo";
import { useNavigate } from "react-router-dom";
import MyComment from "./../components/mypage/MyComment";
import ScrollToTopButton from "../components/common/ScrollToTopButton";

const ITEMS_PER_PAGE = 3; // 페이지당 아이템 수

export default function InfiniteScrollExample() {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  const fetchComments = async (page, size) => {
    try {
      const response = await axios.get(BASE_URL + "/api/comments/my", {
        params: { page, size },
        withCredentials: true,
      });

      if (response.status === 200) {
        if (response.data.data.length === 0) {
          setHasMore(false); // 더 이상 데이터가 없으면 false 설정
        } else {
          setComments((prevComments) => [
            ...prevComments,
            ...response.data.data,
          ]);
        }
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          toast.error("잘못된 요청입니다");
        } else if (status === 401) {
          toast.error("재로그인 후 다시 시도하세요");
          navigate("/login");
        } else if (status === 404) {
          toast.error("댓글을 찾을 수 없습니다");
        } else if (status === 409) {
          toast.error("충돌이 발생했습니다");
        }
      }
    }
  };

  const lastCommentElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // 페이지 증가
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchComments(page, ITEMS_PER_PAGE);
  }, [page]);

  return (
    <div className="flex flex-col items-center">
      <div className="font-bold text-2xl m-5 w-2/3">내 정보</div>

      <EditInfo />
      <div className="font-bold text-2xl m-5 mt-10 w-2/3">내가 쓴 댓글</div>
      {comments.length === 0 ? (
        <div className="m-5">작성한 댓글이 없습니다.</div>
      ) : (
        comments.map((comment, index) => {
          if (comments.length === index + 1) {
            return (
              <MyComment
                ref={lastCommentElementRef}
                key={comment.commentId}
                company={comment.stockName}
                stockId={comment.stockId}
                announcementId={comment.announcementId}
                title={comment.announcementTitle}
                date={comment.createdAt}
                comment={comment.content}
              />
            );
          } else {
            return (
              <MyComment
                key={comment.commentId}
                company={comment.stockName}
                stockId={comment.stockId}
                announcementId={comment.announcementId}
                title={comment.announcementTitle}
                date={comment.createdAt}
                comment={comment.content}
              />
            );
          }
        })
      )}
      {!hasMore && <div className="m-5">더 이상 댓글이 없습니다.</div>}
      <ScrollToTopButton />
    </div>
  );
}

/* eslint-disable react/prop-types */
import React, { useEffect } from "react";

export const CancleVoteModal = ({ isOpen, onClose, onConfirm, message }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // 스크롤 방지
    } else {
      document.body.style.overflow = "unset"; // 스크롤 복원
    }
    return () => {
      document.body.style.overflow = "unset"; // 컴포넌트 언마운트 시 스크롤 복원
    };
  }, [isOpen]);

  if (!isOpen) return null; // 모달이 열리지 않도록 처리

  return (
    <div
      className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50 "
      style={{ width: "100vw", height: "100vh" }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-4/12 mb-60"
        style={{
          height: "auto",
        }}
      >
        <h2 className="text-md">{message}</h2>
        <br></br>
        <div className="flex justify-end gap-4">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:opacity-70"
            onClick={onConfirm}
          >
            확인
          </button>
          <button
            className="bg-gray-300 px-3 py-1  rounded hover:opacity-70"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export const LoginModal = ({ isOpen, onClose, message }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // 스크롤 방지
    } else {
      document.body.style.overflow = "unset"; // 스크롤 복원
    }
    return () => {
      document.body.style.overflow = "unset"; // 컴포넌트 언마운트 시 스크롤 복원
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50 "
      style={{ width: "100vw", height: "100vh" }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-3/12 mb-60"
        style={{
          height: "auto",
        }}
      >
        <h2 className="text-md">{message}</h2>
        <br></br>
        <div className="flex justify-end gap-4">
          <button
            className="bg-primary text-white px-3 py-1 rounded hover:opacity-70"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

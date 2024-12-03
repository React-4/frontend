import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
      style={{ width: "1000px", height: "500px" }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg"
        style={{
          position: "absolute",
          top: "80%",
          left: "20%",
          transform: "translate(55%, -100%)",
          height: "auto",
        }}
      >
        <h2 className="text-lg font-semibold">{message}</h2>
        <br></br>
        <div className="flex justify-end gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            확인
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

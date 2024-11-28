import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-40 right-40">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="p-3 w-10 h-15 bg-slate-300 text-white rounded-full shadow-lg text-center"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;

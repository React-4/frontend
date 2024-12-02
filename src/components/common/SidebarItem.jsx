/* eslint-disable react/prop-types */
import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { removeFromHistory } from "../../utils/history";
import {
  removeFavoriteAnnouncementAPI,
  removeFavoriteStockAPI,
} from "../../services/stockAPI";

export function StockSidebarItem({
  id,
  drawerTitle,
  code,
  name,
  price,
  transaction,
  changeRate,
  gap,
  setStockHisList,
}) {

  const [fav, setFav] = useState(true);  // 좋아요 상태
  const navigate = useNavigate();

  // '최근 본'에서 삭제
  const handleRemoveHist = () => {
    setStockHisList((prev) => prev.filter((item) => item.id !== id));
  };

  // 좋아요를 삭제하는 함수
  const handleRemoveFav = async (type, id) => {
    try {
      if (fav) {
        // stock인 경우에만 처리
        if (type === "stock") {
          await removeFavoriteStockAPI(id); // API 호출
        }
      }

      // 상태 업데이트 후 바로 삭제된 항목을 반영
      setFav(false); // 좋아요 해제 상태로 변경
      setStockHisList((prev) => prev.filter((item) => item.종목id !== id)); // 해당 항목 제거

    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  
  // 이동 처리
  const handleNavigate = () => {
    navigate(`/stock/${id}`, {
      state: { id, name, price, changeRate, transaction, code },
    });
  };

  return (
    <div className="flex flex-row justify-between items-start mx-1 my-3 cursor-pointer">
      <div
        className="font-semibold max-w-25 min-w-20 cursor-pointer"
        onClick={handleNavigate}
      >
        {name}
      </div>
      <div className="flex flex-col items-end  mr-2" onClick={handleNavigate}>
        <div className="font-semibold">{price}</div>
        <div
          className={`flex flex-row text-xs items-end ${
            parseFloat(changeRate) > 0 ? "text-primary-3" : "text-primary-4"
          }`}
        >
          {`${(parseFloat(changeRate) * 100).toFixed(2)}%`}
        </div>
      </div>
      {drawerTitle === "최근 본" ? (
        <CloseIcon onClick={handleRemoveHist} className="cursor-pointer" />
      ) : (
        <span onClick={() => handleRemoveFav("stock", id)} className="cursor-pointer">
          {fav ? (
            <FavoriteIcon style={{ color: "#F04452" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </span>
      )}
    </div>
  );
}

export function DisclosureSidebarItem({
  id,
  drawerTitle,
  company,
  title,
  date,
  setDiscloHisList,
}) {
  const [fav, setFav] = useState(true);
  const navigate = useNavigate();

  // '최근 본'에서 삭제
  const handleRemoveHist = () => {
    setDiscloHisList((prev) => prev.filter((item) => item.id !== id));
  };

  // 좋아요를 삭제하는 함수
  const handleRemoveFav = async (type, id) => {
    try {
      if (fav) {
        if (type === "disclosure") {
          await removeFavoriteAnnouncementAPI(id); // 공시 좋아요 삭제
        }
      }

      setFav(false); // 좋아요 해제 상태로 변경
      setDiscloHisList((prev) => prev.filter((item) => item.id !== id)); // 해당 항목 제거
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  // 이동 처리
  const handleNavigate = () => {
    navigate(`/disclosure/${id}`, {
      state: { id, company, title, date },
    });
  };

  return (
    <div className="flex flex-row justify-between mx-1 my-3">
      <div className="font-semibold max-w-20 min-w-20">{company}</div>
      <div className="flex flex-col items-start">
        <div className="font-semibold text-xs cursor-pointer" onClick={handleNavigate}>
          {title}
        </div>
        <div className="text-xs text-primary-2">{date}</div>
      </div>
      {drawerTitle === "최근 본" ? (
        <CloseIcon onClick={handleRemoveHist} className="cursor-pointer" />
      ) : (
        <span onClick={() => handleRemoveFav("disclosure", id)} className="cursor-pointer">
          {fav ? (
            <FavoriteIcon style={{ color: "#F04452" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </span>
      )}
    </div>
  );
}

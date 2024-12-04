import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import {
  removeFavoriteStockAPI,
  removeFavoriteAnnouncementAPI,
} from "../../services/stockAPI";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { removeFromHistory } from "../../utils/history";

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
  const [fav, setFav] = useState(true);
  const navigate = useNavigate();

  const handleRemoveHist = () => {
    setStockHisList((prev) => prev.filter((item) => item.id !== id));
    removeFromHistory("stock", id);
  };

  const handleRemoveFav = async () => {
    try {
      if (fav) {
        await removeFavoriteStockAPI(id);
      }
      setFav(false);
      setStockHisList((prev) => prev.filter((item) => item.종목id !== id));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleNavigate = () => {
    navigate(`/stock/${id}`, {
      state: {
        data: [{ id, name, price, changeRate, transaction, code }],
      },
    });
  };

  const isPositive = parseFloat(changeRate) > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3
            className="font-bold text-lg mb-1 cursor-pointer hover:text-blue-600 transition-colors duration-200"
            onClick={handleNavigate}
          >
            {name}
          </h3>
          <p className="text-sm text-gray-500">{code}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg">
            {String(price).endsWith("원") ? price : `${Number(price)}원`}
          </p>
          <div
            className={`flex justify-end items-center text-sm ${
              isPositive ? "text-primary-3" : "text-primary-4"
            }`}
          >
            {isPositive ? (
              <ArrowDropUpIcon fontSize="small" />
            ) : (
              <ArrowDropDownIcon fontSize="small" />
            )}
            <div>
              {drawerTitle === "최근 본"
                ? `${parseFloat(changeRate).toFixed(2)}%`
                : `${(parseFloat(changeRate) * 100).toFixed(2)}%`}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        {drawerTitle === "최근 본" ? (
          <CloseIcon
            onClick={handleRemoveHist}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          />
        ) : (
          <span onClick={handleRemoveFav} className="cursor-pointer">
            {fav ? (
              <FavoriteIcon style={{ color: "#F04452" }} />
            ) : (
              <FavoriteBorderIcon className="text-gray-500 hover:text-gray-700" />
            )}
          </span>
        )}
      </div>
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

  const handleRemoveHist = () => {
    setDiscloHisList((prev) => prev.filter((item) => item.id !== id));
    removeFromHistory("disclosure", id);
  };

  const handleRemoveFav = async () => {
    try {
      if (fav) {
        await removeFavoriteAnnouncementAPI(id);
      }
      setFav(false);
      setDiscloHisList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleNavigate = () => {
    navigate(`/disclosure/${id}`, {
      state: {
        data: [{ id, company, title, date }],
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{company}</h3>
        {drawerTitle === "최근 본" ? (
          <CloseIcon
            onClick={handleRemoveHist}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          />
        ) : (
          <span onClick={handleRemoveFav} className="cursor-pointer">
            {fav ? (
              <FavoriteIcon style={{ color: "#F04452" }} />
            ) : (
              <FavoriteBorderIcon className="text-gray-500 hover:text-gray-700" />
            )}
          </span>
        )}
      </div>
      <p
        className="text-sm mb-2 cursor-pointer hover:text-blue-600 transition-colors duration-200"
        onClick={handleNavigate}
      >
        {title}
      </p>
      <div className="flex items-center justify-end text-xs text-gray-500">
        <CalendarTodayIcon fontSize="small" className="mr-1" />
        {date}
      </div>
    </div>
  );
}

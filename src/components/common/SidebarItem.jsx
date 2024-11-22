/* eslint-disable react/prop-types */
import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function StockSidebarItem({
  id,
  drawerTitle,
  company,
  price,
  gap,
  rate,
}) {
  const [fav, setFav] = useState(true);

  const navigate = useNavigate();

  const handleRemoveHist = () => {
    // hist list에서 제거하는 로직 추가
  };
  const handleRemoveFav = () => {
    setFav(false);
    // fav list에서 제거하는 로직 추가
  };

  return (
    <div className="flex flex-row justify-between items-start mx-1 my-3">
      <div
        className="font-semibold max-w-20 min-w-20 cursor-pointer"
        onClick={() => navigate(`/stock/${id}`)}
      >
        {company}
      </div>
      <div className="flex flex-col items-end  mr-2">
        <div className="font-semibold">{price}원</div>
        <div
          // className={`flex flex-row text-xs text-${priceColor} ml-3 items-end `}
          className={`flex flex-row text-xs ml-3 items-end ${
            gap > 0 ? "text-primary-3" : "text-primary-4"
          }`}
        >
          <div className="flex flex-row"> {gap}원 </div>
          <div> ({rate}%)</div>
        </div>
      </div>

      {drawerTitle === "최근 본" ? (
        <>
          <CloseIcon onClick={handleRemoveHist} className="cursor-pointer" />
        </>
      ) : (
        <>
          {" "}
          {fav == true ? (
            <FavoriteIcon
              style={{ color: "#F04452" }}
              onClick={handleRemoveFav}
              className="cursor-pointer"
            />
          ) : (
            <FavoriteBorderIcon
              onClick={() => setFav(true)}
              className="cursor-pointer"
            />
          )}
        </>
      )}
    </div>
  );
}

export function DisclosureSidebarItem({
  id,
  drawerTitle,
  company,
  title,
  desc,
}) {
  const [fav, setFav] = useState(true);
  const handleRemoveHist = () => {
    // hist list에서 제거하는 로직 추가
  };
  const handleRemoveFav = () => {
    setFav(false);
    // fav list에서 제거하는 로직 추가
  };
  const navigate = useNavigate();
  return (
    <div className="flex flex-row mx-1 my-3">
      <div className="font-semibold max-w-20 min-w-20">{company}</div>
      <div className="flex flex-col items-start">
        <div
          className="font-semibold text-xs cursor-pointer"
          onClick={() => navigate(`/disclosure/${id}`)}
        >
          {title}
        </div>
        <div className=" text-xs text-primary-2"> {desc} </div>
      </div>
      {drawerTitle === "최근 본" ? (
        <>
          <CloseIcon onClick={handleRemoveHist} className="cursor-pointer" />
        </>
      ) : (
        <>
          {" "}
          {fav == true ? (
            <FavoriteIcon
              style={{ color: "#F04452" }}
              onClick={handleRemoveFav}
              className="cursor-pointer"
            />
          ) : (
            <FavoriteBorderIcon
              onClick={() => setFav(true)}
              className="cursor-pointer"
            />
          )}
        </>
      )}
    </div>
  );
}

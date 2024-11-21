/* eslint-disable react/prop-types */
import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

export function StockSidebarItem({ drawerTitle, company, price, gap, rate }) {
  const [fav, setFav] = useState(true);
  const [priceColor, setPriceColor] = useState("primary-3");

  useEffect(() => {
    if (Number(gap) < 0) {
      setPriceColor("primary-4");
    } else {
      setPriceColor("primary-3");
    }
  }, [gap]);
  const handleRemoveHist = () => {
    // hist list에서 제거하는 로직 추가
  };
  const handleRemoveFav = () => {
    setFav(false);
    // fav list에서 제거하는 로직 추가
  };

  return (
    <div className="flex flex-row justify-between items-start mx-1 my-3">
      <div className="font-semibold max-w-20 min-w-20 cursor-pointer">
        {company}
      </div>
      <div className="flex flex-col items-end  mr-2">
        <div className="font-semibold">{price}원</div>
        <div
          className={`flex flex-row text-xs text-${priceColor} ml-3 items-end `}
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

export function DisclosureSidebarItem({ drawerTitle, company, title, desc }) {
  const [fav, setFav] = useState(true);
  const handleRemoveHist = () => {
    // hist list에서 제거하는 로직 추가
  };
  const handleRemoveFav = () => {
    setFav(false);
    // fav list에서 제거하는 로직 추가
  };
  return (
    <div className="flex flex-row mx-1 my-3">
      <div className="font-semibold max-w-20 min-w-20">{company}</div>
      <div className="flex flex-col items-start">
        <div className="font-semibold text-xs cursor-pointer">{title}</div>
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

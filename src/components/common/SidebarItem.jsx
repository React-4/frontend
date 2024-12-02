/* eslint-disable react/prop-types */
import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    console.log("handleRemoveStockHistory");
    setStockHisList(removeFromHistory("stock", id));
  };
  const handleRemoveFav = () => {
    setFav(false);
    // fav list에서 제거하는 로직 추가
  };

  const handleNavigate = () => {
    navigate(`/stock/${id}`, {
      state: {
        data: [
          {
            id: id,
            name: name,
            price: price, // 가격
            changeRate: changeRate, // 변동률
            transaction: transaction, // 거래량
            code: code, // 주식 코드
            // 필요한 다른 데이터가 있다면 여기에 추가
          },
        ],
      },
    });
  };

  return (
    <div className="flex flex-row justify-between items-start mx-1 my-3">
      <div
        className="font-semibold max-w-20 min-w-20 cursor-pointer"
        onClick={handleNavigate}
      >
        {name}
      </div>
      <div className="flex flex-col items-end  mr-2">
        <div className="font-semibold">{price}</div>
        <div
          className={`flex flex-row text-xs items-end ${
            gap > 0 ? "text-primary-3" : "text-primary-4"
          }`}
        >
          <div className="flex flex-row">
            {gap}원 ({changeRate}%)
          </div>
        </div>
      </div>

      {drawerTitle === "최근 본" ? (
        <>
          <CloseIcon
            onClick={() => handleRemoveHist("stock")}
            className="cursor-pointer"
          />
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
  setDiscloHisList,
  stockId,
}) {
  const [fav, setFav] = useState(true);
  const handleRemoveHist = () => {
    console.log("remove", id);
    setDiscloHisList(removeFromHistory("disclosure", id));
  };
  const handleRemoveFav = () => {
    setFav(false);
    // fav list에서 제거하는 로직 추가
  };
  const handleNavigate = () => {
    navigate(`/disclosure/${id}`, {
      state: {
        data: [{ company, id, stockId }], // company와 id를 state로 전달
      },
    });
  };
  const navigate = useNavigate();
  return (
    <div className="flex flex-row mx-1 my-3">
      <div className="font-semibold max-w-20 min-w-20">{company}</div>
      <div className="flex flex-col items-start">
        <div
          className="font-semibold text-xs cursor-pointer"
          onClick={handleNavigate}
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

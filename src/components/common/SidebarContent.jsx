/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { StockSidebarItem, DisclosureSidebarItem } from "./SidebarItem";
import { useLogin } from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";

export default function SidebarContent({ drawerTitle, data }) {
  const { loggedIn } = useLogin();
  const navigate = useNavigate();

  const [stockHisList, setStockHisList] = useState([]);
  const [discloHisList, setDiscloHisList] = useState([]);

  useEffect(() => {
    if (drawerTitle === "최근 본") {
      setStockHisList(data.stock || []);
      setDiscloHisList(data.disclosure || []);
    } else if (drawerTitle === "관심") {
      setStockHisList(Object.values(data.stock || {}));
      setDiscloHisList(data.disclosure || []);
    }
  }, [data, drawerTitle]);

  return (
    <Box sx={{ p: 2, height: "100%", mt: 1 }}>
      {loggedIn ? (
        <div className="flex flex-col gap-12">
          <div>
            <Typography
              variant="h6"
              style={{
                fontWeight: "bold",
                color: "#333",
                fontSize: "1.5rem",
              }}
            >
              {drawerTitle} 종목
            </Typography>
            <Divider sx={{ my: 2 }} />
            <div className="h-2/5">
              {stockHisList.length > 0 ? (
                stockHisList.map((d, index) => (
                  <StockSidebarItem
                    key={drawerTitle === "최근 본" ? d.id : d.종목id || index}
                    id={drawerTitle === "최근 본" ? d.id : d.종목id}
                    drawerTitle={drawerTitle}
                    code={drawerTitle === "최근 본" ? d.code : d.종목코드}
                    name={drawerTitle === "최근 본" ? d.company : d.종목명}
                    price={drawerTitle === "최근 본" ? d.price : d.현재가}
                    transaction={
                      drawerTitle === "최근 본"
                        ? d.transaction
                        : d.거래량 || "N/A"
                    }
                    changeRate={drawerTitle === "최근 본" ? d.rate : d.등락률}
                    gap={drawerTitle === "최근 본" ? d.gap : d.gap || 0}
                    setStockHisList={setStockHisList}
                  />
                ))
              ) : (
                <Typography align="center">
                  아직 {drawerTitle} 종목이 없어요
                </Typography>
              )}
            </div>
          </div>
          <div>
            <Typography
              variant="h6"
              style={{ fontWeight: "bold", color: "#333", fontSize: "1.5rem" }}
            >
              {drawerTitle} 공시
            </Typography>
            <Divider sx={{ my: 2 }} />
            <div className="h-2/5">
              {discloHisList.length > 0 ? (
                discloHisList.map((d, index) => (
                  <DisclosureSidebarItem
                    key={d.id || index}
                    id={d.id}
                    drawerTitle={drawerTitle}
                    company={
                      drawerTitle === "최근 본" ? d.company : d.stockName
                    }
                    title={d.title}
                    date={d.date}
                    setDiscloHisList={setDiscloHisList}
                  />
                ))
              ) : (
                <Typography align="center">
                  아직 {drawerTitle} 공시가 없어요
                </Typography>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Typography
            variant="h6"
            style={{ fontWeight: "bold", color: "#333", fontSize: "1.5rem" }}
          >
            {drawerTitle} 목록
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography align="center">
            목록을 저장하려면 <br /> 로그인이 필요해요
          </Typography>
          <div className="flex flex-row justify-center w-full">
            <button
              className="bg-primary w-2/3 p-1 text-white rounded-lg font-bold "
              onClick={() => navigate("/login")}
            >
              로그인 하러가기
            </button>
          </div>
        </div>
      )}
    </Box>
  );
}

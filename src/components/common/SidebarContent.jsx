/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { StockSidebarItem, DisclosureSidebarItem } from "./SidebarItem";
import { useLogin } from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";

export default function SidebarContent({ drawerTitle, data }) {
  const { loggedIn } = useLogin();
  const navigate = useNavigate();
  const [stockHisList, setStockHisList] = useState(data.stock);
  const [discloHisList, setDiscloHisList] = useState(data.disclosure);

  useEffect(() => {
    setStockHisList(data.stock);
    setDiscloHisList(data.disclosure);
  }, [data]); // data가 변경될 때마다 실행

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
              <Typography variant="body1" component="div">
                <div
                  className="max-h-60 min-h-60 overflow-auto p-2 mt-4 
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-track]:bg-gray-100
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-gray-300
                  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                >
                  {stockHisList.length === 0 ? (
                    <div className="text-center">
                      아직 {drawerTitle} 종목이 없어요
                    </div>
                  ) : (
                    <>
                      {" "}
                      {stockHisList.map((d) => {
                        return (
                          <StockSidebarItem
                            key={d.id}
                            id={d.id}
                            drawerTitle={drawerTitle}
                            code={d.code}
                            name={d.company}
                            price={d.price}
                            transaction={d.transaction}
                            changeRate={d.rate}
                            gap={d.gap}
                            setStockHisList={setStockHisList}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              </Typography>
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
              <Typography variant="body1" component="div">
                <div
                  className="max-h-60 min-h-60 overflow-auto p-2 mt-4 
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-track]:bg-gray-100
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-gray-300
                  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                >
                  {discloHisList.length === 0 ? (
                    <div className="text-center">
                      아직 {drawerTitle} 공시가 없어요
                    </div>
                  ) : (
                    <>
                      {discloHisList.map((d) => {
                        return (
                          <DisclosureSidebarItem
                            key={d.id}
                            id={d.id}
                            drawerTitle={drawerTitle}
                            company={d.company}
                            title={d.title}
                            date={d.date}
                            stockId={d.stockId}
                            setDiscloHisList={setDiscloHisList}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              </Typography>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 ">
          <Typography variant="h6">관심 목록</Typography>
          <Divider sx={{ my: 1 }} />
          <div className="flex flex-col items-center gap-10">
            <div className="text-center">
              목록을 저장하려면 <br /> 로그인이 필요해요
            </div>
            <button
              className="bg-primary w-2/3 p-1 text-white rounded-lg font-bold"
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

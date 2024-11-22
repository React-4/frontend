/* eslint-disable react/prop-types */
import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { StockSidebarItem, DisclosureSidebarItem } from "./SidebarItem";
import { useLogin } from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";

export default function SidebarContent({ drawerTitle, data }) {
  const { loggedIn } = useLogin();
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 2, height: "100%", mt: 1 }}>
      {loggedIn ? (
        <div className="flex flex-col gap-12">
          <div>
            <Typography variant="h6">{drawerTitle} 종목</Typography>
            <Divider sx={{ my: 2 }} />
            <div className="h-2/5">
              <Typography variant="body1">
                <div className="max-h-60 min-h-60 overflow-auto p-2 mt-4 ">
                  {data.stock.length === 0 ? (
                    <div className="text-center">
                      아직 {drawerTitle} 종목이 없어요
                    </div>
                  ) : (
                    <>
                      {" "}
                      {data?.stock.map((d) => {
                        return (
                          <StockSidebarItem
                            key={d.id}
                            id={d.id}
                            drawerTitle={drawerTitle}
                            company={d.company}
                            price={d.price}
                            gap={d.gap}
                            rate={d.rate}
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
            <Typography variant="h6">{drawerTitle} 공시</Typography>
            <Divider sx={{ my: 2 }} />
            <div className="h-2/5">
              <Typography variant="body1">
                <div className="max-h-60 min-h-6 overflow-auto p-2 mt-4">
                  {data.disclosure.length === 0 ? (
                    <div className="text-center">
                      아직 {drawerTitle} 공시가 없어요
                    </div>
                  ) : (
                    <>
                      {data?.disclosure.map((d) => {
                        return (
                          <DisclosureSidebarItem
                            key={d.id}
                            id={d.id}
                            drawerTitle={drawerTitle}
                            company={d.company}
                            title={d.title}
                            desc={d.desc}
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

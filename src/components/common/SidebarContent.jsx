/* eslint-disable react/prop-types */
import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import SidebarItem from "./SidebarItem";

export default function SidebarContent({ drawerTitle, data }) {
  return (
    <Box sx={{ p: 2, height: "100%" }}>
      <Typography variant="h6">{drawerTitle} 종목</Typography>
      <Divider sx={{ my: 1 }} />
      <div className="h-2/5">
        <Typography variant="body1">
          {drawerTitle}의 상세 내용이 여기에 표시됩니다.
          {data.map((d) => {
            return <SidebarItem key={d} />;
          })}
        </Typography>
      </div>
      <Typography variant="h6">{drawerTitle} 공시</Typography>
      <Divider sx={{ my: 1 }} />
      <div className="h-2/5">
        <Typography variant="body1">
          {drawerTitle}의 상세 내용이 여기에 표시됩니다.
          {data.map((d) => {
            return <SidebarItem />;
          })}
        </Typography>
      </div>
    </Box>
  );
}

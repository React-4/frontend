import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HistoryIcon from "@mui/icons-material/History";
import Button from "@mui/material/Button";
import SidebarContent from "./SidebarContent";

export default function SidebarWithDrawer() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [favColor, setFavColor] = useState("white");
  const [histColor, setHistColor] = useState("white");
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(drawerTitle);
    if (drawerTitle === "관심") {
      setFavColor("primary-1");
      setData(favStockData);
    } else {
      setFavColor("primary-2");
    }

    if (drawerTitle === "최근 본") {
      setHistColor("primary-1");
      setData([...histStockData]);
    } else {
      setHistColor("primary-2");
    }
  }, [drawerTitle]);
  const handleDrawerOpen = (content) => {
    setDrawerTitle(content);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerTitle("");
    setDrawerOpen(false);
  };

  const favStockData = [
    { title: "카카오", price: "51,100" },
    { title: "카카오", price: "51,100" },
    { title: "카카오", price: "51,100" },
  ];
  const histStockData = [
    { title: "카카오", price: "51,100" },
    { title: "카카오", price: "51,100" },
    { title: "카카오", price: "51,100" },
  ];
  // const favDisclosureData = [{ company: "카카오", title: "기업설명회 안내" }];
  // const histDisclosureData = [{ company: "카카오", title: "기업설명회 안내" }];

  return (
    <Box sx={{ display: "flex", height: "100vh", position: "relative" }}>
      {/* 외부 클릭 시 Drawer 닫기 */}
      {drawerOpen && (
        <Box
          onClick={handleDrawerClose}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />
      )}

      {/* 고정 사이드바 */}
      <Box
        sx={{
          width: "6%",
          height: "100vh",
          backgroundColor: "#f7f7f7",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "5px",
          position: "fixed",
          right: 0,
          zIndex: 2, // 외부 클릭 영역보다 위에 위치하도록 설정
        }}
      >
        <List>
          <ListItem disablePadding>
            <Button onClick={() => handleDrawerOpen("관심")}>
              <div className={`flex flex-col items-center text-${favColor}`}>
                <FavoriteBorderIcon />
                관심
              </div>
            </Button>
          </ListItem>
          {/* <ListItem disablePadding> */}
          <Button onClick={() => handleDrawerOpen("최근 본")}>
            <div className={`flex flex-col items-center text-${histColor}`}>
              <HistoryIcon />
              최근 본
            </div>
          </Button>
          {/* </ListItem> */}
        </List>
      </Box>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        // BackdropProps={{ invisible: true }} // 어두운 배경 제거
        variant="persistent"
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            marginRight: "6%", // 사이드바 옆에 위치하도록 여백 설정
            height: "100vh",
            boxShadow: "none", // 그림자 제거
            backgroundColor: "#f7f7f7",
            zIndex: 3, // 사이드바보다 위에 위치하도록 설정
          },
        }}
      >
        {/* drawer 상세 내용 */}
        <SidebarContent drawerTitle={drawerTitle} data={data} />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginRight: drawerOpen ? "calc(6% + 280px)" : "6%",
          transition: "margin-right 0.3s ease",
        }}
      >
        {/* <Outlet /> 여기에 다른 라우트 내용이 표시될 수 있음 */}
        {/* <Typography variant="h4">메인 콘텐츠 영역</Typography>
        <Typography>
          여기에 메인 콘텐츠가 들어갑니다. 사이드바와 Drawer가 고정된 상태로
          콘텐츠를 표시합니다.
        </Typography> */}
      </Box>
    </Box>
  );
}

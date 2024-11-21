import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HistoryIcon from "@mui/icons-material/History";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Button from "@mui/material/Button";
import SidebarContent from "./SidebarContent";

const favData = {
  stock: [
    { company: "카카오", price: "51,100", gap: "-1300", rate: "3.5" },
    { company: "카카오2", price: "51,100", gap: "-1390", rate: "3.5" },
    { company: "카카오3", price: "51,100", gap: "10", rate: "3.5" },
    { company: "카카오4", price: "51,100", gap: "1300", rate: "3.5" },
    { company: "카카오1", price: "51,100", gap: "-1300", rate: "3.5" },
    {
      company: "카카오5카카오카카오",
      price: "51,100",
      gap: "1300",
      rate: "3.5",
    },
  ],
  disclosure: [
    {
      company: "카카오",
      title: "기업설명회 안내",
      desc: "(주)카카오 기업설명회(IR) 개최(안내공시)",
    },
    {
      company: "카카오2zkzkdh",
      title: "기업설명회 안내2dkssodksso",
      desc: "(주)카카오 기업설명회(IR) 개최(안내공시)주)카카오 기업설명회(IR) 개최(안내공시)",
    },
  ],
};

const histData = {
  stock: [
    { company: "방문카카오", price: "51,100", gap: "-1300", rate: "3.5" },
    { company: "방문카카오2", price: "51,100", gap: "-1390", rate: "3.5" },
    { company: "방문카카오3", price: "51,100", gap: "10", rate: "3.5" },
    { company: "방문카카오4", price: "51,100", gap: "1300", rate: "3.5" },
    { company: "방문카카오1", price: "51,100", gap: "-1300", rate: "3.5" },
    { company: "방문카카오5", price: "51,100", gap: "1300", rate: "3.5" },
  ],
  disclosure: [],
};

export default function SidebarWithDrawer() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [favColor, setFavColor] = useState("black");
  const [histColor, setHistColor] = useState("black");
  const [data, setData] = useState({
    stock: [],
    disclosure: [],
  });

  useEffect(() => {
    console.log(drawerTitle);
    if (drawerTitle === "관심") {
      setFavColor("primary-1");
      setData(favData);
    } else {
      setFavColor("primary-2");
    }

    if (drawerTitle === "최근 본") {
      setHistColor("primary-1");
      setData(histData);
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

  return (
    <Box sx={{ display: "flex", height: "100vh", position: "relative" }}>
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

      <Box
        sx={{
          width: "4%",
          height: "100vh",
          backgroundColor: "#f7f7f7",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "5px",
          position: "fixed",
          right: 0,
          zIndex: 2,
        }}
      >
        <List>
          <ListItem disablePadding>
            <Button onClick={handleDrawerClose}>
              <div className="flex flex-col items-center text-primary-2">
                <HomeOutlinedIcon />
                닫기
              </div>
            </Button>
          </ListItem>
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
        variant="persistent"
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            marginRight: "4%",
            height: "100vh",
            boxShadow: "none",
            backgroundColor: "#f7f7f7",
            zIndex: 3,
          },
        }}
      >
        <SidebarContent drawerTitle={drawerTitle} data={data} />
      </Drawer>
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          marginRight: drawerOpen ? "calc(4% + 300px)" : "4%",
          transition: "margin-right 0.3s ease",
        }}
      ></Box>
    </Box>
  );
}

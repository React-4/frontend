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
import { fetchStockPricesAPI, fetchAnnouncementListAPI } from "../../services/stockAPI";


const initialHistoryData = {
  stock: [],
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

  const getHistoryFromStorage = () => {
    const storedHistory = sessionStorage.getItem("viewHistory");
    return storedHistory ? JSON.parse(storedHistory) : initialHistoryData;
  };

  const getFavoriteIdsFromStorage = () => {
    const stockIds = JSON.parse(localStorage.getItem("favoriteStockIds") || "[]");
    const announcementIds = JSON.parse(localStorage.getItem("favoriteAnnouncementIds") || "[]");
    return { stockIds, announcementIds };
  };
  

  const fetchData = async () => {
    try {
      if (drawerTitle === "관심") {
        const { stockIds, announcementIds } = getFavoriteIdsFromStorage();
        console.log("Favorite stock IDs:", stockIds);
        console.log("Favorite announcement IDs:", announcementIds);
  
        const favoriteStocksResponse = await fetchStockPricesAPI(stockIds);
        const favoriteDisclosuresResponse = await fetchAnnouncementListAPI(announcementIds);
  
        const favoriteStocks = Object.values(favoriteStocksResponse.data || {});
        const favoriteDisclosures = favoriteDisclosuresResponse.data || [];
  
        console.log("Transformed favorite stocks:", favoriteStocks);
        console.log("Favorite disclosures:", favoriteDisclosures);
  
        setData({
          stock: favoriteStocks,
          disclosure: favoriteDisclosures,
        });
  
        setFavColor("primary");
        setHistColor("primary-2");
      } else if (drawerTitle === "최근 본") {
        const historyData = getHistoryFromStorage();
        console.log("History data:", historyData);
  
        setData(historyData);
        setHistColor("primary");
        setFavColor("primary-2");
      } else {
        setFavColor("primary-2");
        setHistColor("primary-2");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  
  useEffect(() => {
    fetchData();
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
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        position: "relative",
        zIndex: "50",
      }}
    >
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
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
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
                <div
                  className={`flex flex-col items-center ${
                    favColor === "primary" ? "text-primary" : "text-primary-2"
                  } `}
                >
                  <FavoriteBorderIcon />
                  관심
                </div>
              </Button>
            </ListItem>
            {/* <ListItem disablePadding> */}
            <Button onClick={() => handleDrawerOpen("최근 본")}>
              <div
                className={`flex flex-col items-center  ${
                  histColor === "primary" ? "text-primary" : "text-primary-2"
                } `}
              >
                <HistoryIcon />
                최근 본
              </div>
            </Button>
          </div>
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
            width: 330,
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

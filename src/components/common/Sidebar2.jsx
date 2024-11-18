import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HistoryIcon from "@mui/icons-material/History";

export default function Sidebar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      {/* 사이드바 */}
      <div className="flex p-4 flex-col bg-primary-1 h-screen">
        <Button
          onClick={toggleDrawer(true)}
          className="text-white px-4 py-2 rounded"
        >
          <div className="flex flex-col items-center text-primary-2">
            <FavoriteBorderIcon />
            관심
          </div>
        </Button>
        <Button
          onClick={toggleDrawer(true)}
          className=" text-white px-4 py-2 rounded"
        >
          <div className="flex flex-col items-center text-primary-2">
            <HistoryIcon />
            최근 본
          </div>
        </Button>
      </div>

      {/* 사이드바 오픈 */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {/* 고정 사이드바 부분 */}
        <div className="flex flex-row-reverse h-screen ">
          <div className="flex p-4 flex-col bg-primary-1 ">
            <Button
              onClick={toggleDrawer(false)}
              className="text-white px-4 py-2 rounded"
            >
              <div className="flex flex-col items-center text-primary-2">
                <FavoriteBorderIcon />
                관심
              </div>
            </Button>
            <Button
              onClick={toggleDrawer(false)}
              className=" text-white px-4 py-2 rounded"
            >
              <div className="flex flex-col items-center text-primary-2">
                <HistoryIcon />
                최근 본
              </div>
            </Button>
          </div>
          <Box
            sx={{ width: 300 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            className="p-4 w-1/12"
          >
            {" "}
            <div>
              <h2 className="text-xl font-bold mb-4">관심 목록</h2>
              <List>
                {["삼성전자", "카카오", "네이버"].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <FavoriteBorderIcon className="text-red-500" />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider className="my-4" />
              <h2 className="text-xl font-bold mb-4">최근 본</h2>
              <List>
                {["LG전자", "현대차", "SK하이닉스"].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <HistoryIcon className="text-gray-500" />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </div>
          </Box>
        </div>
      </Drawer>
    </div>
  );
}

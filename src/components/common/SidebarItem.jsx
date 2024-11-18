import React from "react";
import { Favorite } from "@mui/icons-material";

export default function SidebarItem() {
  return (
    <div className="flex flex-row justify-between items-center">
      <div>카카오</div>
      <div className="flex flex-col items-end">
        <div>51,100원</div>
        <div className="flex flex-row">
          <div> -1,900원 </div>
          <div> (3.5%)</div>
        </div>
      </div>
      <div className="text-primary-3">
        <Favorite />
      </div>
    </div>
  );
}

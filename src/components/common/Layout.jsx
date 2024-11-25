import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ScrollToTop from "./ScrollToTop";

export default function Layout() {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col w-94%">
        <div className="fixed w-94%">
          <Header />
        </div>
        <div className="mx-10 mt-16 h-full ">
          <ScrollToTop />
          <Outlet />
        </div>
      </div>
      <Sidebar />
    </div>
  );
}

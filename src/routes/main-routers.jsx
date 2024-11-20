import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/common/Layout";
import MainPage from "../pages/MainPage";
import SearchResultPage from "../pages/SearchResultPage";
//import MiniDrawer from "../components/common/MiniDrawer";

export const mainRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { element: <MainPage />, index: true }, // / 경로
      { path: "search-result", element: <SearchResultPage /> },
    ],
  },
];


const router = createBrowserRouter(mainRoutes);

export default router;

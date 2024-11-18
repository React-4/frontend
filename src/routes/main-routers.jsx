import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/common/Layout";
import MainPage from "../pages/MainPage";
//import MiniDrawer from "../components/common/MiniDrawer";

export const mainRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [{ element: <MainPage />, index: true }],
  },
];

const router = createBrowserRouter(mainRoutes);

export default router;

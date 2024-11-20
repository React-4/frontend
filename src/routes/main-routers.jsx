import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/common/Layout";
import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import MyPage from "../pages/MyPage";

export const mainRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { element: <MainPage />, index: true },
      { element: <LoginPage />, path: "/login" },
      { element: <MyPage />, path: "/mypage" },
    ],
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
];

const router = createBrowserRouter(mainRoutes);

export default router;

import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/main-routers";
import { LoginProvider } from "./contexts/loginContext";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <LoginProvider>
      <ToastContainer />
      <RouterProvider router={router}></RouterProvider>
    </LoginProvider>
  );
}

export default App;

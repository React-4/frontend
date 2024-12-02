import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/main-routers";
import { LoginProvider } from "./contexts/loginContext";
import { ToastContainer } from "react-toastify";
import { DarkModeProvider } from "./contexts/darkmodeContext";
import { CookiesProvider } from "react-cookie";

function App() {
  return (
    <CookiesProvider>
      <DarkModeProvider>
        <LoginProvider>
          <ToastContainer />
          <RouterProvider router={router}></RouterProvider>
        </LoginProvider>
      </DarkModeProvider>
    </CookiesProvider>
  );
}

export default App;

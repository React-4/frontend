import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/main-routers";
import { LoginProvider } from "./contexts/loginContext";
import { DarkModeProvider } from "./contexts/darkmodeContext";

function App() {
  return (
    <DarkModeProvider>
      <LoginProvider>
        <RouterProvider router={router}></RouterProvider>
      </LoginProvider>
    </DarkModeProvider>
  );
}

export default App;

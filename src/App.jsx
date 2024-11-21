import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/main-routers";
import { LoginProvider } from "./contexts/loginContext";

function App() {
  return (
    <LoginProvider>
      <RouterProvider router={router}></RouterProvider>
    </LoginProvider>
  );
}

export default App;

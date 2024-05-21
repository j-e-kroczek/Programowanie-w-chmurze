import "./App.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./provider/authProvider";
import { Routes } from "./routes";

export const App: React.FC = () => (
  <>
  <AuthProvider>
      <Routes />
    <Toaster position="bottom-right" reverseOrder={false} />
    </AuthProvider>
  </>
);

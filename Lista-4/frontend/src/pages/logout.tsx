import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

export const Logout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  setTimeout(() => {
    handleLogout();
  }, 2 * 1000);

  return (
    <div className="flex justify-center items-center flex-col h-full">
      <div className="flex justify-center items-center">
        <ClipLoader color="#fff" />
      </div>
    </div>
  );
};

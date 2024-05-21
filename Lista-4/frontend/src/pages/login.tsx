import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, setRefreshToken } = useAuth();
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;

  const handleLogin = () => {
    setIsLoading(true);
    axios
      .post(apiURL + "/auth/authenticate", {
        email,
        password,
      })
      .then((response) => {
        setToken(response.data.idToken.jwtToken);
        setRefreshToken(response.data.refreshToken.token);
        toast.success("Logged in successfully");
        navigate("/games-list", { replace: true });
      })
      .catch(() => {
        toast.error("Invalid email or password");
        setIsLoading(false);
      });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex justify-center items-center flex-col h-full">
      <div className="flex justify-center items-center bg-white p-10 rounded-xl flex-col">
        <div className="w-56">
          <img alt="logo" src="../images/logo.png" />
        </div>
        <h1 className="text-5xl font-medium pt-10 pb-5">Tic Tac Toe</h1>
        <div className="w-full max-w-sm py-5">
          <div className="flex items-center border-b border-purple-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Your email"
              aria-label="Full name`"
              onChange={handleEmailChange}
              value={email}
            />
          </div>
          <div className="flex items-center border-b border-purple-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="password"
              placeholder="Your password"
              aria-label="Full name"
              onChange={handlePasswordChange}
              value={password}
            />
          </div>
          <div className="flex items-center justify-end pt-5">
            <button
              className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-3 rounded-full focus:outline-none cursor-pointer"
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

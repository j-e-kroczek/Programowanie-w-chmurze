import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import VerificationInput from "react-verification-input";
import axios from "axios";
import toast from "react-hot-toast";

export const ConfirmRegister = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("email")) {
      navigate("/register", { replace: true });
    }
  }, [navigate]);

  const handleConfirmRegister = () => {
    setIsLoading(true);
    axios
      .post(apiURL + "/auth/confirm_account", {
        email: localStorage.getItem("email"),
        code: code,
      })
      .then(() => {
        localStorage.removeItem("email");
        toast.success("Account confirmed, you can now login");
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response.data.message || "Error confirming account");
        console.log(error);
      });
  };

  return (
    <div className="flex justify-center items-center flex-col h-full">
      <div className="flex justify-center items-center bg-white p-10 rounded-xl flex-col">
        <div className="w-56">
          <img alt="logo" src="../images/logo.png" />
        </div>
        <h1 className="text-5xl font-medium py-10">Tic Tac Toe</h1>
        <div className="w-full max-w-sm py-5">
          <div className="flex items-center py-2">
            <VerificationInput
              validChars="0-9"
              onChange={(value) => {
                setCode(value);
              }}
              classNames={{
                container: "container",
                character: "character",
                characterInactive: "character--inactive",
                characterSelected: "character--selected",
                characterFilled: "character--filled",
              }}
            />
          </div>
          <div className="flex items-center pt-5">
            <button
              className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-3 rounded-full focus:outline-none	"
              onClick={handleConfirmRegister}
              disabled={isLoading || code.length !== 6}
            >
              Confirm Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { useState } from "react";
import { useEffect } from "react";

export const Home: React.FC = () => {
  const [localNickname, setLocalNickname] = useState<string>("");

  const [nickname, setNickname] = useState("");
  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem("nickname", JSON.stringify(nickname));
    window.location.href = "/games-list";
  };
  useEffect(() => {
    console.log(nickname);
  }, [nickname]);

  useEffect(() => {
    if (localStorage.getItem("nickname") !== null) {
      setLocalNickname(JSON.parse(localStorage.getItem("nickname") || ""));
    }
  }, []);

  useEffect(() => {
    if (localNickname !== "") {
      setNickname(localNickname);
    }
  }, [localNickname]);
  return (
    <div className="flex justify-center items-center flex-col h-full">
      <div className="w-64">
        <img alt="logo" src="../images/logo.png" />
      </div>
      <h1 className="text-6xl font-medium py-10">Tic Tac Toe</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm py-10">
        <div className="flex items-center border-b border-purple-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Your nickname"
            aria-label="Full name"
            onChange={handleNicknameChange}
            value={nickname}
          />

          <button
            className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded focus:outline-none	"
            type="submit"
          >
            Start
          </button>
        </div>
      </form>
    </div>
  );
};

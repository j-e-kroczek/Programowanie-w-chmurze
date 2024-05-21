import React from "react";

export const Home: React.FC = () => {
  return (
    <div className="flex justify-center items-center flex-col h-full">
      <div className="flex justify-center items-center bg-white p-10 rounded-xl flex-col">
        <div className="w-56">
          <img alt="logo" src="../images/logo.png" />
        </div>
        <h1 className="text-5xl font-medium py-10">Tic Tac Toe</h1>
        <div className="w-full max-w-sm py-2">
          <div className="flex items-center justify-between ">
            <a href="/register">
              <button className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-3 rounded-full focus:outline-none	">
                Sign up
              </button>
            </a>
            <a href="/login">
              <button className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-3 rounded-full focus:outline-none	">
                Sign in
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

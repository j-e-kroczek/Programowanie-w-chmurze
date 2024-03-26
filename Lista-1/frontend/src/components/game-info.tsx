import React from "react";
import ClockLoader from "react-spinners/ClockLoader";
const GameInfo: React.FC<{
  status: string;
  currentPlayer: string | undefined;
  isCurrentPlayer: boolean;
  handleRestart: () => void;
  handleLeave: () => void;
}> = ({
  handleRestart,
  status,
  currentPlayer,
  isCurrentPlayer,
  handleLeave,
}) => {
  return (
    <div className="absolute w-screen h-screen bg-black/40 top-0 left-0 z-30">
      <div className="flex w-full h-full flex-col justify-center items-center">
        {status === "winner" ? (
          <div className="bg-white p-8 rounded-xl m-5">
            <h1 className="text-2xl font-medium">{currentPlayer} has won!</h1>
            <div
              className={
                isCurrentPlayer
                  ? "flex items-center justify-between"
                  : "flex items-center justify-center"
              }
            >
              {isCurrentPlayer && (
                <button
                  className="flex-shrink-0 rounded-full bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 mt-4  focus:outline-none	"
                  onClick={handleRestart}
                >
                  Restart
                </button>
              )}
              <button
                className="flex-shrink-0 rounded-full bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-4 text-white py-1 px-2 mt-4  focus:outline-none	"
                onClick={handleLeave}
              >
                Leave
              </button>
            </div>
          </div>
        ) : status === "draw" ? (
          <div className="bg-white p-8 rounded-xl m-5">
            <h1 className="text-3xl font-medium">It's a draw!</h1>
            <div
              className={
                isCurrentPlayer
                  ? "flex items-center justify-between"
                  : "flex items-center justify-center"
              }
            >
              {isCurrentPlayer && (
                <button
                  className="flex-shrink-0 rounded-full bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 mt-4  focus:outline-none	"
                  onClick={handleRestart}
                >
                  Restart
                </button>
              )}
              <button
                className="flex-shrink-0 rounded-full bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-4 text-white py-1 px-2 mt-4  focus:outline-none	"
                onClick={handleLeave}
              >
                Leave
              </button>
            </div>
          </div>
        ) : (
          status === "pending" && (
            <div className="bg-white p-8 rounded-xl m-5">
              <div className="flex w-full justify-center pb-4">
                <ClockLoader color="#A855F7" size={30} />
              </div>
              <h1 className="text-3xl font-medium pb-2">
                Waiting for other player
              </h1>

              <button
                className="flex-shrink-0 rounded-full bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-4 text-white py-1 px-2 mt-4  focus:outline-none	"
                onClick={handleLeave}
              >
                Leave
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GameInfo;

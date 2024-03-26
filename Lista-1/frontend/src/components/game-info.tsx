import React from "react";

const GameInfo: React.FC<{
  status: string;
  currentPlayer: string | undefined;
  isWinner: boolean;
  handleRestart: () => void;
}> = ({ handleRestart, status, currentPlayer, isWinner }) => {
  return (
    <div className="absolute w-screen h-screen bg-black/40 top-0 left-0 z-30">
      <div className="flex w-full h-full flex-col justify-center items-center">
        {status === "winner" ? (
          <div className="bg-white p-8 rounded-xl m-5">
            <h1 className="text-2xl font-medium">{currentPlayer} has won!</h1>
            {isWinner && (
              <button
                className="flex-shrink-0 rounded-full bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 mt-4  focus:outline-none	"
                onClick={handleRestart}
              >
                Restart
              </button>
            )}
          </div>
        ) : status === "draw" ? (
          <div className="bg-white p-8 rounded-xl m-5">
            <h1 className="text-3xl font-medium">It's a draw!</h1>
          </div>
        ) : (
          status === "pending" && (
            <div className="bg-white p-8 rounded-xl m-5">
              <h1 className="text-3xl font-medium">
                Waiting for other player...
              </h1>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GameInfo;

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";

const GameCard: React.FC<{ title: string; player: string; gameId: string }> = ({
  title,
  player,
  gameId,
}) => {
  return (
    <div className="relative my-7 border shadow-md border-gray-200 bg-white rounded-full w-full p-3 flex sm:flex-row flex-col align-center justify-between leading-normal">
      <div className="absolute bottom-0 top-0 flex justify-center items-center left-5 sm:left-0">
        <FontAwesomeIcon
          icon={faGamepad}
          className="text-purple-500 text-5xl px-3 sm:px-5 rounded-full bg-gray-200 py-4 sm:py-6"
        />
      </div>
      <div style={{ marginLeft: "100px" }}>
        <div className="mb-1 ms-1 sm:ms-0">
          <div className="text-purple-800 font-semibold text-lg text-start">
            {title} - {gameId}
          </div>
        </div>
        <div className="flex items-center ms-1 sm:ms-0">
          <p className="text-gray-500 leading-none me-2">Player:</p>
          <p className="text-purple-500">{player}</p>
        </div>
      </div>
      <a href="/game" className="flex items-center justify-end me-6 sm:me-0">
        <button
          className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-md border-4 text-white py-1 sm:py-2 px-6 rounded-full focus:outline-none	"
          type="button"
        >
          Join
        </button>
      </a>
    </div>
  );
};

export default GameCard;

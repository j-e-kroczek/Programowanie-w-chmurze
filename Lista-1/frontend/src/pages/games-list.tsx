import GameCard from "../components/game-card";
import CreateGame from "../components/create-game";
import axios from "axios";
import { useEffect, useState } from "react";
import { IGame } from "../interfaces/IGame";
import { toast } from "react-hot-toast";

export const GamesList: React.FC = () => {
  const [gameList, setGameList] = useState<Array<IGame>>([]);

  const apiURL = import.meta.env.VITE_API_URL;

  const gameListApi = apiURL + "/game";

  const [isCreatingGame, setIsCreatingGame] = useState(false);

  const createGameApi = apiURL + "/game/create";

  const joinGameApi = apiURL + "/game/join/";

  const [nickname, setNickname] = useState("");

  const handleNewGame = () => {
    setIsCreatingGame(true);
  };

  const handleCancel = () => {
    setIsCreatingGame(false);
  };

  useEffect(() => {
    console.log(apiURL);
    axios.get(gameListApi).then((response) => {
      setGameList(response.data);
    });
  }, []);

  useEffect(() => {
    console.log(gameList);
  }, [gameList]);

  const handleNewGameCreation = (gameName: string) => {
    setIsCreatingGame(false);
    axios
      .post(createGameApi, {
        name: gameName,
        userName: nickname,
      })
      .then(function (response) {
        localStorage.setItem(
          "playerId",
          JSON.stringify(response.data.playerId)
        );
        localStorage.setItem("gameId", JSON.stringify(response.data.id));
        window.location.href = "/game/" + response.data.id;
      })
      .catch(function () {
        toast.error("Error creating game");
      });
  };

  const handleJoinGame = (gameId: string) => {
    axios
      .post(joinGameApi + gameId, {
        userName: nickname,
      })
      .then(function (response) {
        localStorage.setItem(
          "playerId",
          JSON.stringify(response.data.playerId)
        );
        localStorage.setItem("gameId", JSON.stringify(response.data.id));
        window.location.href = "/game/" + gameId;
      })
      .catch(function () {
        toast.error("Error joining game");
      });
  };

  useEffect(() => {
    if (localStorage.getItem("nickname") !== null) {
      setNickname(JSON.parse(localStorage.getItem("nickname") || ""));
    } else {
      window.location.href = "/";
    }
  }, []);

  return (
    <div>
      {isCreatingGame && (
        <CreateGame
          handleCancel={handleCancel}
          handleSubmit={handleNewGameCreation}
        />
      )}
      <div className="flex items-start w-full flex-col">
        <div className="flex flex-wrap w-full items-center justify-center sm:justify-between mb-10 px-4 py-2 bg-white rounded-full">
          <h1 className="text-3xl font-medium p-3 ">Available games</h1>
          <button
            className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-md border-4 text-white py-1 sm:py-2 px-6 rounded-full focus:outline-none"
            type="button"
            onClick={handleNewGame}
          >
            New game
          </button>
        </div>
        <div className="w-full">
          {gameList.map((game) => (
            <GameCard
              key={game.id}
              title={game.name}
              player={game.player1Name || game.player2Name}
              gameId={game.id}
              handleJoinGame={handleJoinGame}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

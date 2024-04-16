import GameBoard from "../components/game-board";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { IGame } from "../interfaces/IGame";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import GameInfo from "../components/game-info";

export const Game: React.FC<{}> = () => {
  const { id } = useParams();
  console.log(id);
  const socketURL = import.meta.env.VITE_SOCKET_URL;
  const apiURL = import.meta.env.VITE_API_URL;

  const socket = io(socketURL, {
    reconnectionDelayMax: 10000,
  });

  socket.io.on("reconnect", () => {
    console.log("Reconnected");
    socket.emit("joinGame", id);
  });
  const [game, setGame] = useState<IGame | null>(null);

  const [playerId, setPlayerId] = useState<string | null>(null);

  const gameListApi = apiURL + "/game/" + id;

  const makeMoveApi = apiURL + "/game/" + id + "/move";

  const restartGameApi = apiURL + "/game/" + id + "/restart";

  const quitGameApi = apiURL + "/game/" + id + "/quit";

  const [currentPlayerName, setCurrentPlayerName] = useState<
    string | undefined
  >("");

  const handleMove = (row: number, col: number) => {
    axios
      .post(makeMoveApi, {
        playerId: playerId,
        row: row,
        column: col,
      })
      .then(function (response) {
        setGame(response.data);
        socket.emit("updateGame", id);
      })
      .catch(function (error) {
        toast.error(error.response.data.message || "Error making move");
      });
  };

  const handleRestart = () => {
    axios
      .post(restartGameApi, {
        playerId: playerId,
      })
      .then(function (response) {
        toast.success("Game restarted");
        setGame(response.data);
        socket.emit("updateGame", id);
      })
      .catch(function (error) {
        toast.error(error.response.data.message || "Error restarting game");
      });
  };

  const handleLeave = () => {
    axios
      .post(quitGameApi, {
        playerId: playerId,
      })
      .then(function () {
        socket.emit("leaveGame", id);
        window.location.href = "/games-list";
      })
      .catch(function (error) {
        toast.error(error.response.data.message || "Error quiting game");
      });
  };

  useEffect(() => {
    axios.get(gameListApi).then((response) => {
      setGame(response.data);
    });
    if (localStorage.getItem("playerId") !== null) {
      setPlayerId(JSON.parse(localStorage.getItem("playerId") || ""));
    }
    socket.emit("joinGame", id);
    socket.on("gameUpdated", () => {
      axios.get(gameListApi).then((response) => {
        setGame(response.data);
      });
    });
    socket.on("playerJoined", () => {
      axios.get(gameListApi).then((response) => {
        setGame(response.data);
      });
    });
    socket.on("playerLeft", () => {
      axios.get(gameListApi).then((response) => {
        setGame(response.data);
      });
    });
  }, []);

  useEffect(() => {
    if (game?.currentPlayer === game?.player1) {
      setCurrentPlayerName(game?.player1Name);
    } else if (game?.currentPlayer === game?.player2) {
      setCurrentPlayerName(game?.player2Name);
    }
    console.log(game);
  }, [game]);

  return game != null ? (
    <>
      {game.status !== "in-progress" && (
        <GameInfo
          status={game.status}
          currentPlayer={currentPlayerName}
          isCurrentPlayer={game.currentPlayer === playerId}
          handleRestart={handleRestart}
          handleLeave={handleLeave}
        />
      )}
      <div className="flex items-start w-full flex-col">
        <div className="flex flex-wrap w-full items-center justify-center lg:justify-between mb-2 px-4 py-2 bg-white rounded-full">
          <h1 className="text-3xl font-medium p-3">{game?.name}</h1>
          <div className="flex flex-wrap justify-center sm:justify-between w-100">
            <div className="my-1 mx-5 order-1">
              <strong className="me-2 text-purple-700">Player 1:</strong>{" "}
              {game.player1Name ? game.player1Name : "-"}
            </div>
            <div className="my-1 mx-5 order-3 sm:order-2">
              <strong className="me-2 text-purple-700">User turn:</strong>{" "}
              {currentPlayerName ? currentPlayerName : "-"}
            </div>
            <div className="my-1 mx-5 order-2 sm:order-3">
              <strong className="me-2 text-purple-700">Player 2:</strong>{" "}
              {game.player2Name ? game.player2Name : "-"}
            </div>
          </div>
          <button
            className="flex-shrink-0 my-3 sm:my-0 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-md border-4 text-white py-1 sm:py-2 px-6 rounded-full focus:outline-none	"
            type="button"
            onClick={handleLeave}
          >
            Leave game
          </button>
        </div>
        <div className="w-full mt-5 py-5">
          <GameBoard board={game.board} handleMove={handleMove} />
        </div>
      </div>
    </>
  ) : (
    <div>Game does not exist</div>
  );
};

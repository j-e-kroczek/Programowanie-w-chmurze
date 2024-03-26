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

  const socket = io("http://localhost:3000", {
    reconnectionDelayMax: 10000,
  });

  socket.io.on("reconnect", () => {
    console.log("Reconnected");
    socket.emit("joinGame", id);
  });
  const [game, setGame] = useState<IGame | null>(null);

  const [playerId, setPlayerId] = useState<string | null>(null);

  const gameListApi = "http://localhost:3000/api/game/" + id;

  const makeMoveApi = "http://localhost:3000/api/game/" + id + "/move";

  const restartGameApi = "http://localhost:3000/api/game/" + id + "/restart";

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
          isWinner={game.currentPlayer === playerId}
          handleRestart={handleRestart}
        />
      )}
      <div className="flex items-start w-full flex-col">
        <h1 className="text-3xl font-medium pb-7">{game?.name}</h1>
        <div className="flex justify-between w-full text-xl">
          <div>Player 1: {game.player1Name ? game.player1Name : "-"}</div>
          <div>User turn: {currentPlayerName ? currentPlayerName : "-"}</div>
          <div>Player 2: {game.player2Name ? game.player2Name : "-"}</div>
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

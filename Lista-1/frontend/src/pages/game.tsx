import GameBoard from "../components/game-board";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { IGame } from "../interfaces/IGame";

export const Game: React.FC<{}> = () => {
  const { id } = useParams();
  console.log(id);

  const [game, setGame] = useState<IGame | null>(null);

  const gameListApi = "http://localhost:3000/api/game/" + id;

  const [currentPlayerName, setCurrentPlayerName] = useState<
    string | undefined
  >("");

  useEffect(() => {
    axios.get(gameListApi).then((response) => {
      setGame(response.data);
    });
  }, []);

  useEffect(() => {
    if (game?.currentPlayer === game?.player1) {
      setCurrentPlayerName(game?.player1Name);
    } else if (game?.currentPlayer === game?.player2) {
      setCurrentPlayerName(game?.player2Name);
    }
    console.log(game?.board.board[0].row[1].value);
  }, [game]);

  return game != null ? (
    <div className="flex items-start w-full flex-col">
      <h1 className="text-3xl font-medium py-10">{game?.name}</h1>
      <div className="flex justify-between w-full text-xl">
        <div>Player 1: {game.player1Name ? game.player1Name : "-"}</div>
        <div>User turn: {currentPlayerName ? currentPlayerName : "-"}</div>
        <div>Player 2: {game.player2Name ? game.player2Name : "-"}</div>
      </div>
      <div className="w-full mt-5 py-5">
        <GameBoard board={game.board} />
      </div>
    </div>
  ) : (
    <div>Game does not exist</div>
  );
};

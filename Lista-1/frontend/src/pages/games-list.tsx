import GameCard from "../components/game-card";
import axios from "axios";
import { useEffect, useState } from "react";
import { IGame } from "../interfaces/IGame";

export const GamesList: React.FC = () => {
  const [gameList, setGameList] = useState<Array<IGame>>([]);

  const gameListApi = "http://localhost:3000/api/game";

  useEffect(() => {
    axios.get(gameListApi).then((response) => {
      setGameList(response.data);
    });
  }, []);

  useEffect(() => {
    console.log(gameList);
  }, [gameList]);

  return (
    <div className="flex items-start w-full flex-col">
      <h1 className="text-3xl font-medium py-10">Available games</h1>
      <div className="w-full">
        {gameList.map((game) => (
          <GameCard
            key={game.id}
            title={game.name}
            player={game.player1Name || game.player2Name}
            gameId={game.id}
          />
        ))}
      </div>
    </div>
  );
};

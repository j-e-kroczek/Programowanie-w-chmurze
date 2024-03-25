import GameCard from "../components/game-card";

export const GamesList: React.FC = () => {
  const gameList = [
    { title: "Super game 1", player: "Alice", gameId: "123" },
    { title: "Super game 2", player: "Bob", gameId: "456" },
    { title: "Super game 3", player: "Charlie", gameId: "789" },
  ];
  return (
    <div className="flex items-start w-full flex-col">
      <h1 className="text-3xl font-medium py-10">Available games</h1>
      <div className="w-full">
        {gameList.map((game) => (
          <GameCard
            title={game.title}
            player={game.player}
            gameId={game.gameId}
          />
        ))}
      </div>
    </div>
  );
};

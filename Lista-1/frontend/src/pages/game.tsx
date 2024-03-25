import GameBoard from "../components/game-board";

export const Game: React.FC = () => {
  const player1 = "Alice";
  const player2 = "Bob";
  const userTurn = "Alice";
  const gameTitle = "Super game!!!";
  return (
    <div className="flex items-start w-full flex-col">
      <h1 className="text-3xl font-medium py-10">{gameTitle}</h1>
      <div className="flex justify-between w-full text-xl">
        <div>Player 1: {player1}</div>
        <div>User turn: {userTurn}</div>
        <div>Player 2: {player2}</div>
      </div>
      <div className="w-full mt-5 py-5">
        <GameBoard />
      </div>
    </div>
  );
};

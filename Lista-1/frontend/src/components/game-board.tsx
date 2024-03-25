import "../styles/game-board.css";

function GameBoard() {
  return (
    <div className="w-full flex justify-center">
      <div className="game-board">
        <div className="row">
          <div className="cell bottom cross"></div>
          <div className="cell bottom left"></div>
          <div className="cell bottom left"></div>
        </div>
        <div className="row">
          <div className="cell bottom"></div>
          <div className="cell bottom left circle"></div>
          <div className="cell bottom left"></div>
        </div>
        <div className="row">
          <div className="cell"></div>
          <div className="cell left"></div>
          <div className="cell left"></div>
        </div>
      </div>
    </div>
  );
}

export default GameBoard;

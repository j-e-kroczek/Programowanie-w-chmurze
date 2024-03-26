import { Board } from "../interfaces/IGame";
import "../styles/game-board.css";

const GameBoard: React.FC<{
  board: Board;
  handleMove: (row: number, col: number) => void;
}> = ({ board, handleMove }) => {
  const getCharClass = (char: string) => {
    if (char === "P1") return "circle";
    if (char === "P2") return "cross";
    return "";
  };

  return (
    <div className="w-full flex justify-center">
      <div className="game-board">
        <div className="row">
          <div
            onClick={() => {
              handleMove(0, 0);
            }}
            className={
              "cell bottom " + getCharClass(board.board[0].row[0].value)
            }
          ></div>
          <div
            onClick={() => {
              handleMove(0, 1);
            }}
            className={
              "cell bottom left " + getCharClass(board.board[0].row[1].value)
            }
          ></div>
          <div
            onClick={() => {
              handleMove(0, 2);
            }}
            className={
              "cell bottom left " + getCharClass(board.board[0].row[2].value)
            }
          ></div>
        </div>
        <div className="row">
          <div
            onClick={() => {
              handleMove(1, 0);
            }}
            className={
              "cell bottom " + getCharClass(board.board[1].row[0].value)
            }
          ></div>
          <div
            onClick={() => {
              handleMove(1, 1);
            }}
            className={
              "cell bottom left " + getCharClass(board.board[1].row[1].value)
            }
          ></div>
          <div
            onClick={() => {
              handleMove(1, 2);
            }}
            className={
              "cell bottom left " + getCharClass(board.board[1].row[2].value)
            }
          ></div>
        </div>
        <div className="row">
          <div
            onClick={() => {
              handleMove(2, 0);
            }}
            className={"cell " + getCharClass(board.board[2].row[0].value)}
          ></div>
          <div
            onClick={() => {
              handleMove(2, 1);
            }}
            className={"cell left " + getCharClass(board.board[2].row[1].value)}
          ></div>
          <div
            onClick={() => {
              handleMove(2, 2);
            }}
            className={"cell left " + getCharClass(board.board[2].row[2].value)}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;

import { TicTacToeBoard, TicTacToeCell } from "@/app/types/game";
import "./board.css";

export default function Board({ board, makeMove }: { board: TicTacToeBoard, makeMove: (row: number, column: number) => void}) {
  const getClassName = (cell: TicTacToeCell) => {
    switch (cell.value) {
      case 'P1': return 'cell cross';
      case 'P2': return 'cell circle';
      default: return 'cell';
    }
  };

  return (
    console.log(board.board[0].row[0]?.value),
    <div className="game">
      {board.board.map((row, rowIndex) =>
        row.row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className={getClassName(cell)}
            id={`${rowIndex * board.board.length + cellIndex}`}
            onClick={() => makeMove(rowIndex, cellIndex)}
          ></div>
        ))
      )}
    </div>
  );
}

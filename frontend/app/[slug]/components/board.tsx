import { TicTacToeBoard, TicTacToeCell } from "@/app/types/game";
import "./board.css";

export default function Board({ board, makeMove, isPlayerTurn }: { board: TicTacToeBoard, makeMove: (row: number, column: number) => void, isPlayerTurn: boolean}) {
  
  const getClassName = (cell: TicTacToeCell, isPlayerTurn: boolean) => {
    switch (cell.value) {
      case 'P1': return 'cell cross';
      case 'P2': return 'cell circle';
      default: return isPlayerTurn ? 'cell' : 'cell blocked';
    }
  };

  return (
    <div className="game">
      {board.board.map((row, rowIndex) =>
        row.row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className={getClassName(cell, isPlayerTurn)}
            id={`${rowIndex * board.board.length + cellIndex}`}
            {...cell.value === null && isPlayerTurn ? { onClick: () => makeMove(rowIndex, cellIndex) } : {}}
          ></div>
        ))
      )}
    </div>
  );
}

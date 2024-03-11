import { TicTacToeBoard } from "@/app/types/game";
import "./board.css";

export default function Board({ board }: { board: TicTacToeBoard }) {
  return (
    <div className="game">
      <div className="cell cross" id="0"></div>
      <div className="cell" id="1"></div>
      <div className="cell" id="2"></div>
      <div className="cell" id="3"></div>
      <div className="cell circle" id="4"></div>
      <div className="cell" id="5"></div>
      <div className="cell" id="6"></div>
      <div className="cell" id="7"></div>
      <div className="cell" id="8"></div>
    </div>
  );
}

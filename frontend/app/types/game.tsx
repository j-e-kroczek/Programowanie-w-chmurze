import exp from "constants";

type Cell = 'P1' | 'P2' | null;

export type TicTacToeCell = Cell;

interface Row {
  row: [TicTacToeCell, TicTacToeCell, TicTacToeCell];
}

export type TicTacToeRow = Row;

interface Board {
  board: [TicTacToeRow, TicTacToeRow, TicTacToeRow];
}

export type TicTacToeBoard = Board;

type GameStatus = 'pending' | 'in-progress' | 'winner' | 'draw';

export type Game = {
  id: string;
  name: string;
  player1Name: string;
  player2Name: string;
  board: TicTacToeBoard;
  currentPlayer: string;
  status: GameStatus;
  createdAt: Date;
  updatedAt: Date;
};
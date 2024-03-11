type Cell = 'P1' | 'P2' | null;

type TicTacToeCell = Cell;

interface TicTacToeRow {
  row: [TicTacToeCell, TicTacToeCell, TicTacToeCell];
}

interface TicTacToeBoard {
  board: [TicTacToeRow, TicTacToeRow, TicTacToeRow];
}

type GameStatus = 'pending' | 'in-progress' | 'winner' | 'draw';

export type Game = {
  id: string;
  name: string;
  player1: string;
  player2: string;
  board: TicTacToeBoard;
  currentPlayer: string;
  status: GameStatus;
  createdAt: Date;
  updatedAt: Date;
};
export interface IGame {
  id: string;
  name: string;
  player1: string;
  player1Name: string;
  player2: string;
  player2Name: string;
  board: Board;
  createdAt: string;
  currentPlayer: string;
  status: string;
  updatedAt: string;
}

export interface Board {
  board: Array<Row>;
}

export interface Row {
  row: Array<Value>;
}

export interface Value {
  value: string;
}

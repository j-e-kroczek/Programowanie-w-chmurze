import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

type Cell = 'P1' | 'P2' | null;

class TicTacToeCell {
  @IsIn(['X', 'O', null])
  value: Cell;

  constructor(value: Cell) {
    this.value = value;
  }
}

class TicTacToeRow {
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => TicTacToeCell)
  row: TicTacToeCell[];

  constructor(row: TicTacToeCell[]) {
    this.row = row;
  }
}

export class TicTacToeBoard {
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => TicTacToeRow)
  board: TicTacToeRow[];

  constructor(board: TicTacToeRow[]) {
    this.board = board;
  }
}

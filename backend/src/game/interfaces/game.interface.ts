import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';
import { TicTacToeBoard } from './board.interface';

export class Game {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  player1: string;

  @IsString()
  player2: string;

  @IsObject()
  board: TicTacToeBoard;

  @IsString()
  currentPlayer: string;

  @IsNotEmpty()
  @IsEnum(['pending', 'in-progress', 'winner', 'draw'])
  status: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';
import { TicTacToeBoard } from './board.interface';
import { ApiProperty } from '@nestjs/swagger';

export class Game {
  @ApiProperty({
    name: 'Game ID',
    description: 'Unique identifier for the game',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    name: 'Game name',
    description: 'Name of the game',
    example: 'Game 1',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    name: 'Player 1 ID',
    description: 'Unique identifier for player 1',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  player1: string;

  @ApiProperty({
    name: 'Player 1 name',
    description: 'Name of player 1',
    example: 'Alice',
  })
  @IsString()
  player1Name: string;

  @ApiProperty({
    name: 'Player 2 ID',
    description: 'Unique identifier for player 2',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  player2: string;

  @ApiProperty({
    name: 'Player 2 name',
    description: 'Name of player 2',
    example: 'Bob',
  })
  @IsString()
  player2Name: string;

  @ApiProperty({
    name: 'Board',
    description: 'Tic Tac Toe board',
    example: {
      board: [
        {
          row: [{ value: null }, { value: null }, { value: null }],
        },
        {
          row: [{ value: null }, { value: null }, { value: null }],
        },
        {
          row: [{ value: null }, { value: null }, { value: null }],
        },
      ],
    },
  })
  @IsObject()
  board: TicTacToeBoard;

  @ApiProperty({
    name: 'Current player',
    description: 'Current player',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  currentPlayer: string;

  @ApiProperty({
    name: 'Game status',
    description: 'Status of the game',
    example: 'pending',
    enum: ['pending', 'in-progress', 'winner', 'draw'],
  })
  @IsNotEmpty()
  @IsEnum(['pending', 'in-progress', 'winner', 'draw'])
  status: string;

  @ApiProperty({
    name: 'Created at',
    description: 'Date and time the game was created',
    example: '2021-01-01T00:00:00.000Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    name: 'Updated at',
    description: 'Date and time the game was last updated',
    example: '2021-01-01T00:00:00.000Z',
  })
  @IsDate()
  updatedAt: Date;

  constructor(partial: Partial<Game>) {
    Object.assign(this, partial);
  }
}

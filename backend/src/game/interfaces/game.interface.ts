import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

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

  @IsNotEmpty()
  @IsEnum(['pending', 'in-progress', 'completed'])
  status: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

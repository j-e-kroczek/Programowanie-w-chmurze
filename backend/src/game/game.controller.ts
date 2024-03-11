import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getAvailableGames() {
    return this.gameService.checkAvailableGames();
  }

  @Post('create')
  createGame(@Body() body: { name: string; userName: string }) {
    if (!body.name) {
      throw new HttpException('Name is required', 400);
    }
    const game = this.gameService.createGame(body.name, body.userName);
    return { id: game.id, playerid: game.player1 };
  }

  @Post('join/:id')
  joinGame(@Param('id') id: string, @Body() body: { userName: string }) {
    const game = this.gameService.findOne(id);
    if (!game) {
      throw new HttpException('Game not found', 404);
    }
    if (this.gameService.isGameAvailable(game.id)) {
      const playerId = this.gameService.addPlayerToGame(game.id, body.userName);
      if (this.gameService.isGameReady(game)) {
        this.gameService.startGame(game);
      }
      return { id: game.id, playerid: playerId };
    }
    throw new HttpException('Game not available', 400);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  getGame(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(':id/move')
  makeMove(
    @Param('id') id: string,
    @Body() body: { playerId: string; row: number; column: number },
  ) {
    const game = this.gameService.findOne(id);
    if (!game) {
      throw new HttpException('Game not found', 404);
    }
    if (game.status !== 'in-progress') {
      throw new HttpException('Game not in progress', 400);
    }
    if (game.currentPlayer !== body.playerId) {
      throw new HttpException('Not your turn', 400);
    }
    this.gameService.makeMove(game, body.row, body.column, body.playerId);
    return this.gameService.findOne(id);
  }
}

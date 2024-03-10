import { Injectable } from '@nestjs/common';
import { Game } from './interfaces/game.interface';

@Injectable()
export class GameService {
  private readonly games: Game[] = [];

  create(game: Game): void {
    this.games.push(game);
  }

  findAll(): Game[] {
    return this.games;
  }

  findOne(id: string): Game {
    return this.games.find((game) => game.id === id);
  }

  update(id: string, game: Game): void {
    const index = this.games.findIndex((game) => game.id === id);
    this.games[index] = game;
  }

  remove(id: string): void {
    const index = this.games.findIndex((game) => game.id === id);
    this.games.splice(index, 1);
  }

  checkAvailableGames(): Game[] {
    return this.games.filter(
      (game) => game.player1 === null || game.player2 === null,
    );
  }

  getGameByPlayerId(playerId: string): Game {
    return this.games.find(
      (game) => game.player1 === playerId || game.player2 === playerId,
    );
  }

  isGameAvailable(gameId: string): boolean {
    const game = this.findOne(gameId);
    return game.player1 === null || game.player2 === null;
  }

  isPlayerInGame(gameId: string, playerId: string): boolean {
    const game = this.findOne(gameId);
    return game.player1 === playerId || game.player2 === playerId;
  }

  addPlayerToGame(gameId: string, playerId: string): void {
    const game = this.findOne(gameId);
    if (game.player1 === null) {
      game.player1 = playerId;
    } else {
      game.player2 = playerId;
    }
    this.update(gameId, game);
  }
}

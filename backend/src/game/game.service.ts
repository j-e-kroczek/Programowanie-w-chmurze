import { Injectable } from '@nestjs/common';
import { Game } from './interfaces/game.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {
  private readonly games: Game[] = [];

  findAll(): Game[] {
    return this.games;
  }

  update(id: string, game: Game): void {
    const index = this.games.findIndex((game) => game.id === id);
    this.games[index] = game;
  }

  remove(id: string): void {
    const index = this.games.findIndex((game) => game.id === id);
    this.games.splice(index, 1);
  }

  findOne(id: string): Game {
    return this.games.find((game) => game.id === id);
  }

  createGame(name: string, userName: string): Game {
    const game: Game = new Game({
      id: uuidv4(),
      name,
      player1: uuidv4(),
      player1Name: userName,
      player2: null,
      player2Name: null,
      board: {
        board: [
          { row: [{ value: null }, { value: null }, { value: null }] },
          { row: [{ value: null }, { value: null }, { value: null }] },
          { row: [{ value: null }, { value: null }, { value: null }] },
        ],
      },
      currentPlayer: null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.games.push(game);
    return game;
  }

  checkAvailableGames(): Game[] {
    const games = this.games.filter(
      (game) => game.player1 === null || game.player2 === null,
    );
    return games;
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

  addPlayerToGame(gameId: string, playerName: string): string {
    const game = this.findOne(gameId);
    const playerId = uuidv4();
    if (game.player1 === null) {
      game.player1 = playerId;
      game.player1Name = playerName;
    } else {
      game.player2 = playerId;
      game.player2Name = playerName;
    }
    this.update(gameId, game);
    return playerId;
  }

  removePlayerFromAllGames(playerId: string): void {
    this.games.forEach((game) => {
      if (game.player1 === playerId) {
        game.player1 = null;
      }
      if (game.player2 === playerId) {
        game.player2 = null;
      }
      this.update(game.id, game);
    });
  }

  removeEmptyGames(): void {
    this.games.forEach((game) => {
      if (game.player1 === null && game.player2 === null) {
        this.remove(game.id);
      }
    });
  }

  isPlayerTurn(game: Game, playerId: string): boolean {
    return game.currentPlayer === playerId;
  }

  isGameDraw(game: Game): boolean {
    return game.board.board.every((row) =>
      row.row.every((cell) => cell.value !== null),
    );
  }

  isGameReady(game: Game): boolean {
    return game.player1 !== null && game.player2 !== null;
  }

  isPlayerGameAdmin(gameId: string, playerId: string): boolean {
    const game = this.findOne(gameId);
    return game.player1 === playerId;
  }

  startGame(game: Game): void {
    game.currentPlayer = game.player1;
    game.status = 'in-progress';
    this.update(game.id, game);
  }

  isGameFinished(game: Game): boolean {
    return game.status === 'winner' || game.status === 'draw';
  }

  makeMove(game: Game, row: number, column: number, playerId: string): boolean {
    if (!this.isPlayerTurn(game, playerId)) {
      return false;
    }
    if (game.board.board[row].row[column].value !== null) {
      return false;
    }
    game.board.board[row].row[column].value =
      playerId === game.player1 ? 'P1' : 'P2';
    game.currentPlayer =
      playerId === game.player1 ? game.player2 : game.player1;
    game.updatedAt = new Date();
    this.update(game.id, game);
    return true;
  }

  isGameWinner(game: Game): boolean {
    const board = game.board.board;
    console.log(board);
    return false;
  }

  checkGameStatus(game: Game): void {
    if (this.isGameDraw(game)) {
      game.status = 'draw';
      this.update(game.id, game);
      return;
    }
    if (this.isGameWinner(game)) {
      game.status = 'winner';
      this.update(game.id, game);
      return;
    }
  }
}

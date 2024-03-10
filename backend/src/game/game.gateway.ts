import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { GameService } from './game.service';
import { Game } from './interfaces/game.interface';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GameGateway.name);
  constructor(private gameService: GameService) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('check-lobby')
  handleCheckLobby(client: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    const availableGames = this.gameService.checkAvailableGames();
    this.logger.log(`Available games: ${availableGames.length}`);
    client.emit('available-games', availableGames);
  }

  @SubscribeMessage('create-game')
  handleCreateGame(client: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    if (
      this.gameService
        .findAll()
        .filter(
          (game) => game.player1 === client.id || game.player2 === client.id,
        ).length > 0
    ) {
      this.logger.log(`Client id: ${client.id} already has a game`);
      client.emit(
        'game-created',
        this.gameService.getGameByPlayerId(client.id),
      );
      return;
    }
    const game: Game = {
      id: uuidv4(),
      name: 'Game',
      player1: client.id,
      player2: null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.gameService.create(game);
    client.emit('game-created', game);
    client.broadcast.emit('game-created', game);
  }

  @SubscribeMessage('join-game')
  handleJoinGame(client: any, gameId: string) {
    this.logger.log(`Message received from client id: ${client.id}`);
    if (this.gameService.isPlayerInGame(gameId, client.id)) {
      this.logger.log(`Client id: ${client.id} already in game`);
      client.emit('game-joined', this.gameService.getGameByPlayerId(client.id));
      return;
    }
    if (this.gameService.isGameAvailable(gameId)) {
      this.gameService.addPlayerToGame(gameId, client.id);
      const game = this.gameService.findOne(gameId);
      client.emit('game-joined', game);
      client.broadcast.emit('game-joined', game);
      return;
    }
    client.emit('game-not-available');
  }
}

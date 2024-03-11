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
    this.gameService.removePlayerFromAllGames(client.id);
    this.gameService.removeEmptyGames();
  }

  @SubscribeMessage('check-lobby')
  handleCheckLobby(client: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    const availableGames = this.gameService.checkAvailableGames();
    this.logger.log(`Available games: ${availableGames.length}`);
    client.emit('available-games', availableGames);
  }

  @SubscribeMessage('join-game')
  handleJoinGame(client: any, gameId: string) {
    this.logger.log(`Message received from client id: ${client.id}`);
    if (this.gameService.findOne(gameId) === undefined) {
      this.logger.log(`Game id: ${gameId} does not exist`);
      client.emit('game-not-available');
      return;
    }
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

  @SubscribeMessage('start-game')
  handleStartGame(client: any, gameId: string) {
    this.logger.log(`Message received from client id: ${client.id}`);
    const game = this.gameService.findOne(gameId);
    if (this.gameService.isPlayerGameAdmin(gameId, client.id)) {
      this.gameService.startGame(game);
      client.emit('game-started', game);
      client.broadcast.emit('game-started', game);
    }
    return;
  }
}

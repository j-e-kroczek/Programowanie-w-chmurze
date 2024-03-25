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
    this.gameService.removeEmptyGames();
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(client: any, payload: any) {
    const game = this.gameService.findOne(payload);
    if (game) {
      this.logger.log(`Client id: ${client.id} joined game ${game.id}`);
      client.join(game.id);
      client.to(game.id).emit('playerJoined');
    } else {
      client.emit('gameError', 'Game not found');
    }
  }

  @SubscribeMessage('leaveGame')
  handleLeaveGame(client: any, payload: any) {
    const game = this.gameService.findOne(payload);
    if (game) {
      this.logger.log(`Client id: ${client.id} left game ${game.id}`);
      client.leave(game.id);
      client.to(game.id).emit('playerLeft');
    } else {
      client.emit('gameError', 'Game not found');
    }
  }

  @SubscribeMessage('updateGame')
  handleUpdateGame(client: any, payload: any) {
    const game = this.gameService.findOne(payload);
    if (game) {
      this.logger.log(`Client id: ${client.id} updated game ${game.id}`);
      client.to(game.id).emit('gameUpdated');
    } else {
      client.emit('gameError', 'Game not found');
    }
  }
}

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
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Game } from './interfaces/game.interface';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiTags('game')
  @ApiOperation({ summary: 'Get available games' })
  @ApiResponse({
    status: 200,
    description: 'List of available games',
    type: [Game],
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getAvailableGames() {
    return this.gameService.checkAvailableGames();
  }

  @ApiTags('game')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Game 1',
          description: 'Name of the game',
        },
        userName: {
          type: 'string',
          example: 'Alice',
          description: 'Your name',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({
    status: 201,
    description: 'Game created',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'Game ID',
        },
        playerId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'Your player ID',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Name is required',
  })
  @Post('create')
  createGame(@Body() body: { name: string; userName: string }) {
    if (!body.name) {
      throw new HttpException('Name is required', 400);
    }
    const game = this.gameService.createGame(body.name, body.userName);
    return {
      id: game.id,
      playerId: game.player1,
    };
  }

  @ApiTags('game')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        playerId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'Your player ID',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Quit any game' })
  @ApiResponse({
    status: 200,
    description: 'Game quit',
  })
  @Post('quit-any')
  quitAnyGame(@Body() body: { playerId: string }) {
    this.gameService.removePlayerFromAllGames(body.playerId);
    this.gameService.removeEmptyGames();
    return { message: 'Game quit' };
  }

  @ApiTags('game')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userName: {
          type: 'string',
          example: 'Alice',
          description: 'Your name',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Join a game' })
  @ApiResponse({
    status: 200,
    description: 'Game joined',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'Game ID',
        },
        playerId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'Your player ID',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Game not available',
  })
  @Post('join/:id')
  joinGame(@Param('id') id: string, @Body() body: { userName: string }) {
    const game = this.gameService.findOne(id);
    if (!game) {
      throw new HttpException('Game not found', 404);
    }
    if (this.gameService.isGameAvailable(game.id)) {
      const playerData = this.gameService.addPlayerToGame(
        game.id,
        body.userName,
      );
      if (this.gameService.isGameReady(game)) {
        this.gameService.startGame(game);
      }
      return {
        id: game.id,
        playerId: playerData.pubKey,
      };
    }
    throw new HttpException('Game not available', 400);
  }

  @ApiTags('game')
  @ApiOperation({ summary: 'Get game by ID' })
  @ApiResponse({
    status: 200,
    description: 'Game found',
    type: Game,
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  getGame(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @ApiTags('game')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        playerId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'Your player ID',
        },
        row: {
          type: 'number',
          example: 0,
          description: 'Row number',
        },
        column: {
          type: 'number',
          example: 0,
          description: 'Column number',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Make a move' })
  @ApiResponse({
    status: 200,
    description: 'Move made',
    type: Game,
  })
  @ApiResponse({
    status: 400,
    description: 'Game not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Game not in progress',
  })
  @ApiResponse({
    status: 400,
    description: 'Not your turn',
  })
  @ApiResponse({
    status: 400,
    description: 'Auth fail',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid move',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(':id/move')
  makeMove(
    @Param('id') id: string,
    @Body()
    body: {
      playerId: string;
      row: number;
      column: number;
    },
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
    if (!this.gameService.authPlayer(game.id, body.playerId)) {
      throw new HttpException('Auth fail', 400);
    }
    if (this.gameService.makeMove(game, body.row, body.column, body.playerId)) {
      return this.gameService.findOne(id);
    }
    throw new HttpException('Invalid move', 400);
  }

  @ApiTags('game')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        playerId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'Your player ID',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Restart a game' })
  @ApiResponse({
    status: 200,
    description: 'Game restarted',
    type: Game,
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Auth fail',
  })
  @Post(':id/restart')
  @UseInterceptors(ClassSerializerInterceptor)
  restartGame(@Param('id') id: string, @Body() body: { playerId: string }) {
    const game = this.gameService.findOne(id);
    if (!game) {
      throw new HttpException('Game not found', 404);
    }
    if (!this.gameService.authPlayer(game.id, body.playerId)) {
      throw new HttpException('Auth fail', 400);
    }
    this.gameService.restartGame(game);
    return this.gameService.findOne(id);
  }

  @ApiTags('game')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        playerId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'Your player ID',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Quit a game' })
  @ApiResponse({
    status: 200,
    description: 'Game quit',
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Auth fail',
  })
  @Post(':id/quit')
  quitGame(@Param('id') id: string, @Body() body: { playerId: string }) {
    const game = this.gameService.findOne(id);
    if (!game) {
      throw new HttpException('Game not found', 404);
    }
    if (!this.gameService.authPlayer(game.id, body.playerId)) {
      throw new HttpException('Auth fail', 400);
    }
    this.gameService.removePlayerFromAllGames(body.playerId);
    this.gameService.removeEmptyGames();
    return { message: 'Game quit' };
  }
}

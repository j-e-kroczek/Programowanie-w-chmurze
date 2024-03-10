import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameController } from './game/game.controller';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';

@Module({
  imports: [],
  controllers: [AppController, GameController],
  providers: [AppService, GameGateway, GameService],
})
export class AppModule {}

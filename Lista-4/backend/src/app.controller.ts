import { Controller, Get, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from './auth/guards/jwt.guard';

@Controller('')
export class AppController {
  @Get('')
  @UseGuards(JwtAuthenticationGuard)
  helloWorld() {}
}

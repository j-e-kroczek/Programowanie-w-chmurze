import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticateRequestDto } from './dto/authenticate.request.dto';
import { RegisterRequestDto } from './dto/register.request.dto';
import { AccountConfirmationRequestDto } from './dto/account_confirmation.request.dto';
import { RefreshTokenRequestDto } from './dto/refresh_token.request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerRequest: RegisterRequestDto) {
    try {
      return await this.authService.register(registerRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post('authenticate')
  async authenticate(@Body() authenticateRequest: AuthenticateRequestDto) {
    try {
      return await this.authService.authenticate(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('confirm_account')
  async confirmAccount(
    @Body() accountConfirmationRequest: AccountConfirmationRequestDto,
  ) {
    try {
      return await this.authService.confirmRegistration(
        accountConfirmationRequest,
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('refresh_token')
  async refreshToken(@Body() refreshTokenRequest: RefreshTokenRequestDto) {
    try {
      return await this.authService.refreshToken(refreshTokenRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

import { IsEmail, IsString } from 'class-validator';

export class AuthenticateRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

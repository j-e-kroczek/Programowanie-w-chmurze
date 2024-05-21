import { IsString } from 'class-validator';

export class AccountConfirmationRequestDto {
  @IsString()
  email: string;

  @IsString()
  code: string;
}

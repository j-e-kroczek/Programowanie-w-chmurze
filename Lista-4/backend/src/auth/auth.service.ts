import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { ConfigService } from '@nestjs/config';
import { RegisterRequestDto } from './dto/register.request.dto';
import { AuthenticateRequestDto } from './dto/authenticate.request.dto';
import { AccountConfirmationRequestDto } from './dto/account_confirmation.request.dto';
import { RefreshTokenRequestDto } from './dto/refresh_token.request.dto';

@Injectable()
export class AuthService {
  [x: string]: any;
  private userPool: CognitoUserPool;

  constructor(private configService: ConfigService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get<string>('AWS_COGNITO_USER_POOL_ID'),
      ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
    });
  }

  async register(authRegisterRequest: RegisterRequestDto) {
    const { username, email, password } = authRegisterRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [new CognitoUserAttribute({ Name: 'nickname', Value: username })],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async authenticate(user: AuthenticateRequestDto) {
    const { email, password } = user;
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async getUser(email: string) {
    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.getUserAttributes((err, result) => {
        if (!result) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async confirmRegistration(
    confirmationRequest: AccountConfirmationRequestDto,
  ) {
    const { email, code } = confirmationRequest;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.confirmRegistration(code, true, (err, result) => {
        if (!result) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async refreshToken(token_request: RefreshTokenRequestDto) {
    const { refreshToken } = token_request;
    const userData = {
      Username: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.refreshSession(
        new CognitoRefreshToken({ RefreshToken: refreshToken }),
        (err, session) => {
          if (!session) {
            reject(err);
          } else {
            resolve(session);
          }
        },
      );
    });
  }
}

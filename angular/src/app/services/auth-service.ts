import { LastLoginData } from './../model/last-login-data';
import { AuthResponse } from './../model/server-responses-models/auth-response';
import { Injectable } from '@angular/core';
import { GetLastLoginDataResponse, LoginResponse } from './../../proto/messages_pb';
import {InteropService} from './interop.service';
@Injectable()
export class AuthService {

  public isOffline: boolean = false;
  public userId: number;
  public email: string = '';
  public loginType: string = '';

  constructor(private interopService: InteropService) {
  }

  async getLastLoginData(): Promise<LastLoginData> {
    return this.interopService.getLastLoginData();
  }

  async getToken(): Promise<string> {
    const lastLoginData = await this.getLastLoginData();
    return lastLoginData.token;
  }

  async hasValidToken(): Promise<boolean> {
    const lastLoginData = await this.getLastLoginData();
    this.email = lastLoginData.email;
    this.userId = lastLoginData.userId;
    return lastLoginData.isTokenValid;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.interopService.login(email, password);
  }

  async loginSocial(values: any): Promise<AuthResponse> {
    return this.interopService.loginSocial(values.email, values.provider, values.token);
  }

  async logout(): Promise<void> {
    await this.interopService.logout();
  }

  async signup(email: string, password: string): Promise<AuthResponse> {
    return this.interopService.register(email, password);
  }


  async readTokenAndUserameFromStorage(): Promise<any> {
    return null;
  }

  async loginOffline(): Promise<void> {
    return null;
  }
}



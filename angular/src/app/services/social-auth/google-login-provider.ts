import { InteropService } from './../interop.service';
import { BaseLoginProvider } from './base-login-provider';
import { SocialUser } from './../../model/social-auth/social-user';
import { LoginOpt } from './social-auth-service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { GoogleAuthResponse } from './../../model/server-responses-models/google-auth-response';

export class GoogleLoginProvider extends BaseLoginProvider {

  public static readonly PROVIDER_ID: string = 'GOOGLE';

  protected auth2: any;

  constructor(private http: HttpClient, private interopService: InteropService, private opt: LoginOpt = { scope: 'email' }) { super(); }

  initialize(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
    });
  }

  signIn(opt?: LoginOpt): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      this.interopService.googleSignIn().then(result => {
          const jsonResult = JSON.parse(result);
          const user = new SocialUser()
          user.email = jsonResult['email'];
          user.idToken = jsonResult['idToken'];
          resolve(user);
      })
    });
  }

  signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
    });
  }

  revokeAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
    });
  }

}

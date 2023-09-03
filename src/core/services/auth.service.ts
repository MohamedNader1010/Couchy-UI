import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GenericService } from './generic.service';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';

import { environment } from 'src/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _cryptoSecretKey = environment.cryptoSecretKey;
  constructor(private _jwtHelper: JwtHelperService, private _adminService: GenericService<any>) {}
  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');

    return !!token;
  }
  public authenticateUser(token: string): void {
    if (token && !this._jwtHelper.isTokenExpired(token)) {
      sessionStorage.setItem('token', token);
      // navigate to dashboard
      window.location.href = '/';
    } else {
      this.clearSession();
      // navigat to login page
      window.location.href = '/auth/login';
    }
  }
  public getToken(): string | null {
    if (this.isAuthenticated()) return sessionStorage.getItem('token');
    return '';
  }
  public clearSession() {
    sessionStorage.clear();
  }
 

}

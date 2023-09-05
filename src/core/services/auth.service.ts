import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GenericService } from './generic.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _jwtHelper: JwtHelperService, private _adminService: GenericService<any>, private _router: Router) {}
  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');

    return !!token;
  }
  public authenticateUser(token: string): void {
    if (token && !this._jwtHelper.isTokenExpired(token)) {
      sessionStorage.setItem('token', token);
      // navigate to dashboard
      // window.location.href = '/';
      this._router.navigate(['/']);
    } else {
      this.clearSession();
      // navigat to login page
      // window.location.href = '/auth/login';
      this._router.navigate(['auth/login']);
    }
  }
  public getToken(): string | null {
    if (this.isAuthenticated()) return sessionStorage.getItem('token');
    return '';
  }
  public clearSession() {
    sessionStorage.clear();
  }
  public getUserId(): string {
    const token: string = sessionStorage.getItem('token') ?? '';
    const decodedToken = this._jwtHelper.decodeToken(token);
    return decodedToken.uid;
  }
  public getUserName() {
    const token: string = sessionStorage.getItem('token') ?? '';
    const decodedToken = this._jwtHelper.decodeToken(token);
    return decodedToken.sub;
  }
}

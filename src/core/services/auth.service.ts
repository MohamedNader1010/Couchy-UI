import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _jwtHelper: JwtHelperService,  private _router: Router) {}
  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token;
  }
  public authenticateUser(token: string): void {
    if (!this.isTokenExpired(token)) {
      sessionStorage.setItem('token', token);
      this._router.navigate(['/']);
    } else {
      this.clearSession();
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
  public isTokenExpired(token: string) : boolean {
    return token && !this._jwtHelper.isTokenExpired(token) ? false : true;
  }
}

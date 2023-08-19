import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');

    return !!token;
  }
  public authenticateUser(token: string): void {
    sessionStorage.setItem('token', token);
    // navigate to dashboard
    window.location.href = '/'; 
  }
}

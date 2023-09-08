import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardClass implements CanActivate {
  constructor(private router: Router, private _authService: AuthService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const token = sessionStorage.getItem('token') as string;
    if (!this._authService.isTokenExpired(token)) {
      return true;
    } else {
      this.router.navigate(['auth/login']);
      return false;
    }
  }
}

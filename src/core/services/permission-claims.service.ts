import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PermissionClaims } from 'src/modules/shared/enums/permissionClaims.enum';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PermissionClaimsService {
  private _permissions: any;

  constructor(private _jwtHelper: JwtHelperService, private _authService: AuthService, private _router: ActivatedRoute) {
  }

  public getPermission(permissionClaim: PermissionClaims) {
    if (this._permissions) {
      return this._permissions[+permissionClaim];
    } else {
      this.setPermissionClaims(); 
      return this._permissions[+permissionClaim];
    }
  }
  public canAccessModule(permissionClaim: PermissionClaims): boolean {
    if (!this._permissions) return false;
    const permissions = this._permissions[+permissionClaim];
    return permissions && (permissions.CanAdd || permissions.CanUpdate || permissions.CanDelete || permissions.CanGet);
  }
  public setPermissionClaims() {
    if(window.location.href.includes('payment')) {
      return;
    }
    const token = this._authService.getToken();
    if (token && !this._jwtHelper.isTokenExpired(token)) {
      const decodedToken = this._jwtHelper.decodeToken(token);
      this._permissions = JSON.parse(decodedToken.PermissionClaims);
    } else {
      this._authService.authenticateUser(token ?? '');
    }
  }
}

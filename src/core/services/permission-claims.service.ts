import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PermissionClaims } from 'src/modules/shared/enums/permissionClaims.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionClaimsService {
  private _permissions: any;

  constructor(private _jwtHelper: JwtHelperService, private _authService: AuthService) {
    const token = this._authService.getToken();
    if (token && !this._jwtHelper.isTokenExpired(token)) {
      const decodedToken = this._jwtHelper.decodeToken(token);
      this._permissions = JSON.parse(decodedToken.PermissionClaims);
    } else {
      this._authService.authenticateUser(token ?? '');
    }
  }

  public getPermission(permissionClaim: PermissionClaims) {
    return this._permissions[+permissionClaim];
  }
  public canAccessModule(permissionClaim: PermissionClaims): boolean {
    const permissions = this._permissions[+permissionClaim];
    return permissions && (permissions.CanAdd || permissions.CanUpdate || permissions.CanDelete || permissions.CanGet);
  }
}

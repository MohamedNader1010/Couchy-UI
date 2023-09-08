import { Component, OnInit } from '@angular/core';
import { LoginAdmin } from './interfaces/loginAdmin.interface';
import { GenericService } from 'src/core/services/generic.service';
import { AuthService } from 'src/core/services/auth.service';
import { AlertService } from 'src/core/services/alert.service';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { UpdateLogoService } from 'src/core/services/update-logo.service';
import { Settings } from '../../settings/interfaces/setttings.interface';
import { HttpClient } from '@angular/common/http';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  password: string = '';
  error: string = '';
  email: string = '';
  isSubmitted: boolean = false;
  constructor(private _loginService: GenericService<LoginAdmin>, private _authService: AuthService, private _alertService: AlertService, private _permissionService: PermissionClaimsService) {}
  ngOnInit(): void {
    this._loginService.setControllerName('Authorization/LogInAdmin');
  }
  login() {
    if (this.password != null && this.email != null) {
      const credentials: LoginAdmin = {
        email: this.email,
        password: this.password,
      };

      this._loginService.add(credentials).subscribe((loginResponse: any) => {
        const result = loginResponse as any;
        if (result.code == ResponseCode.LoggedInSuccessfully) {
          this._authService.authenticateUser(result.body.token);
          this._permissionService.setPermissionClaims();
          this.isSubmitted = true;
          this._alertService.success(result.message);
        } else {
          this.isSubmitted = false;
          this._alertService.fail(result.message);
        }
      });
    }
  }
}

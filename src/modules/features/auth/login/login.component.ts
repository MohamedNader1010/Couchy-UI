import { Component, OnInit } from '@angular/core';
import { LoginAdmin } from './interfaces/loginAdmin.interface';
import { GenericService } from 'src/core/services/generic.service';
import { AuthService } from 'src/core/services/auth.service';
import { AlertService } from 'src/core/services/alert.service';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { LanguageService } from 'src/core/services/language.service';
import { catchError } from 'rxjs';
import { ValidateEmailService } from 'src/modules/shared/services/validate-email.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./logn.component.scss'],
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
  isLoading = false;
  password: string = '';
  error: string = '';
  email: string = '';
  isSubmitted: boolean = false;
  constructor(
    private _loginService: GenericService<LoginAdmin>,
    private _authService: AuthService,
    private _alertService: AlertService,
    private _permissionService: PermissionClaimsService,
    private _langService: LanguageService,
    public validateEmail: ValidateEmailService,
  ) {}
  ngOnInit(): void {
    this._loginService.setControllerName('Authorization/LogInAdmin');
  }
  login() {
    if (this.password != null && this.email != null) {
      const credentials: LoginAdmin = {
        email: this.email,
        password: this.password,
      };
      this.isLoading = true;
      this._loginService
        .add(credentials)
        .pipe(
          catchError((error) => {
            this._alertService.fail(error.message);
            this.isLoading = false;
            return [];
          }),
        )
        .subscribe((loginResponse: any) => {
          const result = loginResponse as any;
          if (result.code == ResponseCode.LoggedInSuccessfully) {
            this._authService.authenticateUser(result.body.token);
            this._permissionService.setPermissionClaims();
            this.isSubmitted = true;
            this._alertService.success(result.message);
            this._langService.setLanguage(result.body.lang);
          } else {
            this.isSubmitted = false;
            this._alertService.fail(result.message);
          }
          this.isLoading = false;
        });
    }
  }
  isValid() {
    if (!this.password || !this.email || !this.validateEmail.isValidEmail(this.email)) {
      return false;
    } else {
      return true;
    }
  }
}

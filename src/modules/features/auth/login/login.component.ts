import { Component, OnInit } from '@angular/core';
import { LoginAdmin } from './interfaces/loginAdmin.interface';
import { GenericService } from 'src/core/services/generic.service';
import { AuthService } from 'src/core/services/auth.service';
import { AlertService } from 'src/core/services/alert.service';
import { Auth } from './interfaces/auth.interface';
import { ResponseInfoDto } from 'src/modules/shared/interfaces/response.interface';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';

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
  constructor(private _loginService: GenericService<LoginAdmin>, private _authService: AuthService, private _alertService: AlertService) {}
  ngOnInit(): void {
    this._loginService.setControllerName('Authorization/LogInAdmin');
  }
  login() {
    if (this.password != null && this.email != null) {
      const credintials: LoginAdmin = {
        email: this.email,
        password: this.password,
      };
      this._loginService.add(credintials).subscribe((data: any) => {
        let result = data as ResponseInfoDto<Auth>;

        if (result.code == ResponseCode.LoggedInSuccessfully) {
          this._authService.authenticateUser(result.body.token);
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

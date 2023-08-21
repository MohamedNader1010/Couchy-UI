import { Component, OnInit } from '@angular/core';
import { LoginAdmin } from './interfaces/loginAdmin.interface';
import { GenericService } from 'src/core/services/generic.service';
import { AuthService } from 'src/core/services/auth.service';
import { MessageService } from 'primeng/api';

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
  constructor(private _loginService: GenericService<LoginAdmin>, private _authService: AuthService,private _messageService:MessageService) {}
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
        if (data.isSuccess) {
          this._authService.authenticateUser(data.token);
          this.isSubmitted = true;
          this._messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: data.message,
            life: 3000,
          });
        }
        else {
          this.isSubmitted = false;
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: data.message,
            life: 3000,
          });
        }
      });
    }
  }
}

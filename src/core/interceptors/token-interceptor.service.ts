import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private _authService: AuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const authToken = this._authService.getToken();

    if (authToken) {
      const modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(request);
  }
}

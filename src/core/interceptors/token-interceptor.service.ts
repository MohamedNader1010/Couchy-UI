import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private _authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const authToken = this._authService.getToken();

    if (authToken) {
      const modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });

      return next.handle(modifiedRequest)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              // I have to refresh token here.....
              this._authService.clearSession();
            }
            return throwError(error);
          })
        );
    }

    return next.handle(request);
  }
}

import { Injectable } from '@angular/core';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
@Injectable({
  providedIn: 'root',
})
export class ValidateEmailService {
  constructor() {}

  isValidEmail(email: string): boolean {
    if (email) {
      return EMAIL_PATTERN.test(email);
    }
    return false;
  }
}

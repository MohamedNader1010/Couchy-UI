import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private _messageService: MessageService) {}

  public success(message: string) {
    this._messageService.add({
      severity: 'success',
      summary: 'Successful', // should be translated
      detail: message,
      life: 3000,
    });
  }
  public fail(message: string) {
    this._messageService.add({
      severity: 'fail',
      summary: 'Failure', // should be translated
      detail: message,
      life: 3000,
    });
  }
  public warn (message:string) {
    this._messageService.add({
      severity: 'warn',
      summary: 'Warning', // should be translated
      detail: message,
      life: 3000,
    });
  }
}

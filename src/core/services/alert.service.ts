import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private _translate: TranslateService, private _messageService: MessageService) {}

  public success(message: string) {
    this._messageService.add({
      severity: this._translate.instant('alert.severity.success'),
      summary: this._translate.instant('alert.summary.Successful'),
      detail: message,
      life: 3000,
    });
  }
  public fail(message: string) {
    this._messageService.add({
      severity: this._translate.instant('alert.severity.error'),
      summary: this._translate.instant('alert.summary.Error'),
      detail: message,
      life: 3000,
    });
  }
  public warn(message: string) {
    this._messageService.add({
      severity: this._translate.instant('alert.severity.warn'),
      summary: this._translate.instant('alert.summary.Warning'),
      detail: message,
      life: 3000,
    });
  }
}

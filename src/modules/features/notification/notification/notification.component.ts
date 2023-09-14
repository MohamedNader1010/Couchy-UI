import { Component } from '@angular/core';
import { NotifyUsers } from '../interfaces/notification.interface';
import { UserTypes } from '../enums/types.enums';
import { GenericService } from 'src/core/services/generic.service';
import { AlertService } from 'src/core/services/alert.service';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  isLoading = false;
  notifications: NotifyUsers[] = [];
  notification: NotifyUsers = {} as NotifyUsers;
  notificationOptions: any[] = [];

  submitted = false;

  constructor(private _notificationService: GenericService<NotifyUsers>, private _alertService: AlertService, private _translate: TranslateService) {
    this._translate.onLangChange.subscribe(_ => {
      this.initComponents();
    })
    this.initComponents();
  }
  SendNotificaiton() {
    this._notificationService.setControllerName('Notification');
    this._notificationService.add(this.notification).subscribe((result) => {
      if (result.code == ResponseCode.Success) {
        this._alertService.success(result.message);
      } else {
        this._alertService.fail(result.message);
      }
    });
  }
  private initComponents() {
    this.notificationOptions = [];
    this.notificationOptions = [
      { label: this._translate.instant('labels.general'), value: +UserTypes.General },
      { label: this._translate.instant('labels.trainer'), value: +UserTypes.Trainer },
      { label: this._translate.instant('labels.user'), value: +UserTypes.User },
    ];
  }
}

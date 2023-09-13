import { Component } from '@angular/core';
import { NotifyUsers } from '../interfaces/notification.interface';
import { UserTypes } from '../enums/types.enums';
import { GenericService } from 'src/core/services/generic.service';
import { AlertService } from 'src/core/services/alert.service';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  isLoading = false;
  notifications: NotifyUsers[] = [];
  notification: NotifyUsers = {} as NotifyUsers;
  notificationOptions = [
    { label: 'general', value: +UserTypes.General },
    { label: 'admin', value: +UserTypes.Trainer },
    { label: 'general', value: +UserTypes.User },
  ];
  submitted = false;

  constructor(private _notificationService: GenericService<NotifyUsers>, private _alertService: AlertService) {}
  SendNotificaiton() {
    this._notificationService.setControllerName('Notification');
    this._notificationService.add(this.notification).subscribe((result) => {
      if(result.code == ResponseCode.Success) {
        this._alertService.success(result.message);
      } else {
        this._alertService.fail(result.message)
      }
    });
  }
}

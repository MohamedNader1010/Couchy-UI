import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/core/services/generic.service';
import { Message } from '../interfaces/message.interface';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AlertService } from 'src/core/services/alert.service';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { PermissionClaims } from 'src/modules/shared/enums/permissionClaims.enum';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  isLoading = false;
  claim: any;
  breadcrumbItems: MenuItem[] = [];
  columns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  textColumns: any[] = [];
  trainerDialog: boolean = false;
  submitted: boolean = false;
  message: Message = {} as Message;
  messages: Message[] = [];
  constructor(private _messageApiService: GenericService<Message[]>, private _alertService: AlertService, private _permissionService: PermissionClaimsService, private _translate: TranslateService) {
    this.claim = this._permissionService.getPermission(PermissionClaims.MessagePermission);

    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.dashboard'), routerLink: '/' });
    this.breadcrumbItems.push({ label: this._translate.instant('labels.message') });

    this.columns = [
      { field: 'id', header: this._translate.instant('table.columns.id'), sortable: true },
      { field: 'messageBody', header: this._translate.instant('labels.message'), sortable: true },
    ];
    this.textColumns = this.columns.filter((col) => col);
  }
  ngOnInit(): void {
    this.isLoading = true;
    this._messageApiService.setControllerName('Message');
    this._messageApiService.getAll()
    .pipe(
      catchError((errorMessage) => {
        this._alertService.fail(errorMessage.message)
        return [];
      })
    )
    .subscribe((result) => {
      if (result.code == ResponseCode.Success) {
        this.messages = result.body;
        this.isLoading = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

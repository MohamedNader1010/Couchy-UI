import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/core/services/generic.service';
import { Message } from '../interfaces/message.interface';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AlertService } from 'src/core/services/alert.service';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { PermissionClaims } from 'src/modules/shared/enums/permissionClaims.enum';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';

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
  constructor(private _messageApiService: GenericService<Message[]>, private _alertService: AlertService, private _permissionService: PermissionClaimsService) {
    this.claim = this._permissionService.getPermission(PermissionClaims.MessagePermission);

    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Dashboard', routerLink: '/' });
    this.breadcrumbItems.push({ label: 'Messages' });

    this.columns = [
      { field: 'id', header: 'Id', sortable: true },
      { field: 'messageBody', header: 'Message', sortable: true },
    ];
    this.textColumns = this.columns.filter((col) => col);
  }
  ngOnInit(): void {
    this.isLoading = true; 
    this._messageApiService.setControllerName('Message');
    this._messageApiService.getAll().subscribe((result) => {      
      if(result.code == ResponseCode.Success) {
        this.messages = result.body;
        this.isLoading = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

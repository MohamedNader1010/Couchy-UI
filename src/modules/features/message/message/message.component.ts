import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/core/services/generic.service';
import { Message } from '../interfaces/message.interface';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  columns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  textColumns: any[] = [];
  trainerDialog: boolean = false;
  submitted: boolean = false;
  message: Message = {} as Message;
  messages: Message[] = [];
  constructor(private _messageApiService: GenericService<Message>, private _messageToastService: MessageService) {
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
    this._messageApiService.setControllerName('Message');
    this._messageApiService.getAll().subscribe((data: Message[]) => {
      this.messages = data;
      this._messageToastService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Messages Retreived',
        life: 3000,
      })
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

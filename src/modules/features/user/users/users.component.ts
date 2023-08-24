import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { GenericService } from 'src/core/services/generic.service';
import { Users } from 'src/modules/shared/interfaces/users.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  users: Users[] = [];
  columns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  textColumns: any[] = [];

  constructor(private _userService: GenericService<Users[]>) {
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Dashboard', routerLink: '/' });
    this.breadcrumbItems.push({ label: 'Users' });
    this.columns = [
      { field: 'id', header: 'Id', sortable: true },
      { field: 'name', header: 'User Name', sortable: true },
      { field: 'phoneNumber', header: 'Phone Number', sortable: true },
    ];
    this.textColumns = this.columns.filter((col) => col);
  }

  ngOnInit(): void {
    this._userService.setControllerName('User/User');
    this._userService.getAll().subscribe((result) => {
      result.body.forEach((trainer: any) => {
        this.users.push({
          name: trainer.name,
          phoneNumber: trainer.mobileNumber,
          id: trainer.id,
        });
      });
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

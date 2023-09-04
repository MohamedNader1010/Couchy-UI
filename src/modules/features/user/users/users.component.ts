import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { GenericService } from 'src/core/services/generic.service';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { PermissionClaims } from 'src/modules/shared/enums/permissionClaims.enum';
import { Users } from 'src/modules/shared/interfaces/users.interface';
import { CategoryIsActiveDto } from '../../categories/interfaces/update-isActive-category.dto';
import { AlertService } from 'src/core/services/alert.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  claim: any;
  breadcrumbItems: MenuItem[] = [];
  users: Users[] = [];
  columns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  textColumns: any[] = [];

  constructor(private _userService: GenericService<Users[]>, private _permissionService: PermissionClaimsService, private _alertService : AlertService) {
    this.claim = this._permissionService.getPermission(PermissionClaims.UserPermission);
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Dashboard', routerLink: '/' });
    this.breadcrumbItems.push({ label: 'Users' });
    this.columns = [
      { field: 'id', header: 'Id', sortable: true },
      { field: 'name', header: 'User Name', sortable: true },
      { field: 'mobileNumber', header: 'Mobile Number', sortable: true },
      { field: 'isActive', header: 'Is Active' },
    ];
    this.textColumns = this.columns.filter((col) => !(col.field === 'isActive'));
  }

  ngOnInit(): void {
    this._userService.setControllerName('User/User');
    this._userService.getAll().subscribe((result) => {
      result.body.forEach((user: any) => {
        this.users.push(user);
      });
    });
  }

  onToggleSwitch(id: string, newValue: boolean) {
    this._userService.setControllerName('User/UpdateIsActive');
    const updateIsActive: CategoryIsActiveDto = {
      isActive: newValue,
      id: id,
    };
    this._userService.update(updateIsActive as any).subscribe((result:any) => {
      const updatedIndex = this.users.findIndex((c) => c.id === id);
      if (updatedIndex !== -1) {
        if (result.body.isActive) {
          this._alertService.success('Activated');
        } else {
          this._alertService.warn('DeActivated');
        }
        this.users[updatedIndex] = result.body as any;
      }
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

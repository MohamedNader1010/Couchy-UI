import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { GenericService } from 'src/core/services/generic.service';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { PermissionClaims } from 'src/modules/shared/enums/permissionClaims.enum';
import { Users } from 'src/modules/shared/interfaces/users.interface';
import { CategoryIsActiveDto } from '../../categories/interfaces/update-isActive-category.dto';
import { AlertService } from 'src/core/services/alert.service';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  isLoading = false;
  claim: any;
  breadcrumbItems: MenuItem[] = [];
  users: Users[] = [];
  columns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  textColumns: any[] = [];

  constructor(private _userService: GenericService<Users[]>, private _permissionService: PermissionClaimsService, private _alertService: AlertService, private _translate: TranslateService) {
    this.claim = this._permissionService.getPermission(PermissionClaims.UserPermission);
    this.initComponent(); 
    this._translate.onLangChange.subscribe(_ => {
      this.initComponent();
    })
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._userService.setControllerName('User/User');
    this._userService.getAll().subscribe((result) => {
      if (result.code == ResponseCode.Success) {
        this.users = result.body;
      } else {
        this._alertService.fail(result.message);
      }
      this.isLoading = false;
    });
  }

  onToggleSwitch(id: string, newValue: boolean) {
    this.isLoading = true;
    this._userService.setControllerName('User/UpdateIsActive');
    const updateIsActive: CategoryIsActiveDto = {
      isActive: newValue,
      id: id,
    };
    this._userService.update(updateIsActive as any).subscribe((result: any) => {
      if (result.code == ResponseCode.Success) {
        const updatedIndex = this.users.findIndex((c) => c.id === id);
        if (updatedIndex !== -1) {
          if (result.body.isActive) {
            this._alertService.success(this._translate.instant("labels.activated"));
          } else {
            this._alertService.warn(this._translate.instant('labels.deActivated'));
          }
          this.users[updatedIndex] = result.body as any;
        }
      } else {
        this._alertService.fail(result.message); 
      }
      this.isLoading = false;
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  private initComponent() {
    this.columns = [];
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.dashboard'), routerLink: '/' });
    this.breadcrumbItems.push({ label: this._translate.instant('user.title') });
    this.columns = [
      { field: 'id', header: this._translate.instant('table.columns.id'), sortable: true },
      { field: 'name', header: this._translate.instant('table.columns.username'), sortable: true },
      { field: 'mobileNumber', header: this._translate.instant('table.columns.phoneNumber'), sortable: true },
      { field: 'isActive', header: this._translate.instant('table.columns.isActive') },
    ];
    this.textColumns = this.columns.filter((col) => !(col.field === 'isActive'));
  }
}

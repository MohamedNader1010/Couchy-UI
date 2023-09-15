import { Component, OnInit } from '@angular/core';
import { AdminDto } from '../interfaces/admin';
import { GenericService } from 'src/core/services/generic.service';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { AlertService } from 'src/core/services/alert.service';
import { CategoryIsActiveDto } from '../../../categories/interfaces/update-isActive-category.dto';
import { PermissionEntry } from 'src/modules/shared/interfaces/permissionsEntry';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { PermissionClaims } from 'src/modules/shared/enums/permissionClaims.enum';
import { LanguageService } from 'src/core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  isLoading = false;
  claim: any;
  _permissions: { [key: number]: PermissionEntry }[] = [];
  permissionsToBeEdited: any;
  _idToBeDeleted: number = 0;
  breadcrumbItems: MenuItem[] = [];
  adminDialog: boolean = false;
  deleteCategoryDialog: boolean = false;
  admins: AdminDto[] = [];
  admin: AdminDto = {} as AdminDto;
  submitted: boolean = false;
  columns: any[] = [];
  textColumns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  constructor(
    private _adminService: GenericService<AdminDto[]>,
    private _alertService: AlertService,
    private _permissionService: PermissionClaimsService,
    public languageService: LanguageService,
    private _translate: TranslateService,
  ) {
    this.claim = this._permissionService.getPermission(PermissionClaims.AdminPermission);
  }

  ngOnInit(): void {
    this._translate.onLangChange.subscribe(event => { 
      this.initComponents();
    })
    this.initComponents()
  }

  openNew() {
    this.submitted = false;
    this.adminDialog = true;
  }
  onToggleSwitch(id: string, newValue: boolean) {
    this.isLoading = true;
    this._adminService.setControllerName('User/UpdateIsActive');
    const updateIsActive: CategoryIsActiveDto = {
      isActive: newValue,
      id: id,
    };
    this._adminService.update(updateIsActive as any).subscribe((result: any) => {
      const updatedIndex = this.admins.findIndex((c) => c.id === id);
      if (updatedIndex !== -1) {
        if (result.body.isActive) {
          this._alertService.success(this._translate.instant('alert.Activated'));
        } else {
          this._alertService.warn(this._translate.instant('alert.DeActivated'));
        }
        this.admins[updatedIndex] = result.body;
        this.adminDialog = false;
      }
      this.isLoading = false;
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  handlePermissionChanged(permissions: { [key: number]: PermissionEntry }[]) {
    this._permissions = permissions;
  }

  hideDialog() {
    this.adminDialog = false;
    this.submitted = false;
    this.admin = {} as AdminDto;
  }
  editAdmin(admin: AdminDto) {
    this.isLoading = true;
    this._adminService.setControllerName('User/GetAdminPermission');
    this._adminService.getById(admin.id as any).subscribe((result) => {
      if (result.code == ResponseCode.Success) {
        this.admin = { ...(admin as AdminDto) };
        this.admin.permissions = result.body as any;
        this.adminDialog = true;
      } else {
        this.admin = { ...(admin as AdminDto) };
        this.adminDialog = true;
      }
      this.isLoading = false;
    });
  }

  saveAdmin() {
    this.isLoading = true;
    if (!this.admin.id) {
      this.admin.permissions = this._permissions;
      this._adminService.setControllerName('User/AddAdmin');
      this._adminService.add(this.admin as any)
      .pipe(catchError((error) => {
        this.isLoading = false;
        this.admin = {} as AdminDto;
        this.adminDialog = false;
        this._alertService.fail(error.message)
        return [];
      }))
      .subscribe((result: any) => {
        if (result.code == ResponseCode.Success) {
          this._alertService.success(result.message);
          this.admins.push(result.body);
        } else {
          this._alertService.fail(result.message);
        }
        this.isLoading = false;
        this.admin = {} as AdminDto;
        this.adminDialog = false;
      });
    } else {
      this.admin.permissions = this._permissions;
      this._adminService.setControllerName('User/UpdateAdmin');
      this._adminService
        .update(this.admin as any)
        .pipe(
          catchError((errorMessage) => {
            this._alertService.fail(errorMessage.message);
            this.isLoading = false;
            this.admin = {} as AdminDto;
            this.adminDialog = false;
            return [];
          }),
        )
        .subscribe((result: any) => {
          if (result.code == ResponseCode.Success) {
            this._alertService.success(result.message);
            const updatedIndex = this.admins.findIndex((c) => c.id === this.admin.id);
            if (updatedIndex !== -1 && result.code == +ResponseCode.Success) {
              this.admins[updatedIndex] = result.body as any;
              this.adminDialog = false;
              this.submitted = true;
              this.admin = {} as AdminDto;
            }
          } else {
            this._alertService.fail(result.error.message);
          }
          this.isLoading = false;
          this.admin = {} as AdminDto;
          this.adminDialog = false;
        });
    }
  }
  isValidPhoneNumber(): boolean {
    const phoneNumber = this.admin.mobileNumber;
    const pattern = /^[956]\d{7}$/; 
    return pattern.test(phoneNumber ?? '');
  }
  isValid() {
    if (!this.admin.email  || !this.admin.name || !this.admin.password || !this.isValidPhoneNumber()) {
      return false;
    } else {
      return true;
    }
  }
  private initComponents() {
    this.columns = [];
    if (this.claim.CanGet) {
      this.isLoading = true;
      this._adminService.setControllerName('User/Admin');
      this._adminService.getAll().subscribe((result) => {
        this.admins = result.body;
        this.isLoading = false;
      });
      this.columns = [
        { field: 'id', header: this._translate.instant('table.columns.id'), sortable: true },
        { field: 'name', header: this._translate.instant('table.columns.name'), sortable: true },
        { field: 'email', header: this._translate.instant('table.columns.email'), sortable: true },
        { field: 'isActive', header: this._translate.instant('table.columns.isActive'), sortable: true },
        { field: 'actions', header: '' },
      ];
      this.textColumns = this.columns.filter((col) => !(col.field === 'isActive' || col.field === 'actions'));
    }
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.dashboard'), routerLink: '/' });
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.admin') });
  }
}

import { Component, OnInit } from '@angular/core';
import { Groups } from '../../interfaces/groups.interface';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/core/services/alert.service';
import { GenericService } from 'src/core/services/generic.service';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { MenuItem } from 'primeng/api';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { Table } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  isLoading = false;
  _trainerId = '';
  _idToBeDeleted: number = 0;

  breadcrumbItems: MenuItem[] = [];
  groupDialog: boolean = false;
  deleteGroupDialog: boolean = false;
  groups: Groups[] = [];
  group: Groups = {} as Groups;
  submitted: boolean = false;
  columns: any[] = [];
  textColumns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _translate: TranslateService,
    private _alertService: AlertService,
    private _groupService: GenericService<Groups[]>,
    public permissionClaimService: PermissionClaimsService,
  ) {}
  ngOnInit(): void {
    this.isLoading = true;
    this._activatedRoute.queryParams.subscribe((param) => {
      this._trainerId = param['id'] || 0;
      this._groupService.setControllerName('Group/ByTrainerId');
      this._groupService
        .getById(this._trainerId)
        .pipe(
          catchError((error) => {
            this._alertService.fail(error.message);
            this.isLoading = false;
            return [];
          }),
        )
        .subscribe((result) => {
          if (result.code == +ResponseCode.Success) {
            this.groups = result.body;
            this._alertService.success(result.message);
          } else {
            this._alertService.fail(result.message);
          }
          this.isLoading = false;
        });
    });
    this.columns = [
      { field: 'id', header: this._translate.instant('table.columns.id'), sortable: true },
      { field: 'nameEn', header: this._translate.instant('table.columns.name'), sortable: true },
      { field: 'userList', header: this._translate.instant('table.columns.userList'), sortable: true },
      { field: 'actions', header: this._translate.instant('table.columns.actions') },
    ];
    this.textColumns = this.columns.filter((col) => !(col.field === 'actions' || col.field === 'userList'));

    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.dashboard'), routerLink: '/' });
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.groups') });
  }

  openNew() {
    this.submitted = false;
    this.groupDialog = true;
  }

  editGroup(groupToBeUpdated: Groups) {
    this.groupDialog = true;
    this.group = groupToBeUpdated;
    this.group.trainerId = this._trainerId;
  }

  deleteGroup(groupToBeDeleted: Groups) {
    this._idToBeDeleted = groupToBeDeleted.id ?? 0;
    this.group = {} as Groups;
    this.deleteGroupDialog = true;
  }

  confirmDelete() {
    this.isLoading = true;
    this._groupService.setControllerName('Group');
    if (this._idToBeDeleted)
      this._groupService.delete(this._idToBeDeleted)
      .pipe(catchError((error) => {
        this._alertService.fail(error.message);
        this.isLoading = false;
        return [];
      }))
      .subscribe((result) => {
        if (result.code == ResponseCode.Success) {
          const deletedIndex = this.groups.findIndex((c) => c.id == this._idToBeDeleted);
          if (deletedIndex !== -1) {
            this.groups.splice(deletedIndex, 1);
            this._idToBeDeleted = 0;
            this._alertService.success(result.message);
          }
        } else {
          this._alertService.fail(result.message);
        }
        this.isLoading = false;
      });
    this.deleteGroupDialog = false;
  }

  hideDialog() {
    this.groupDialog = false;
    this.group = {} as Groups;
  }

  saveGroup() {
    this.isLoading = true;
    this.group.trainerId = this._trainerId;
    if (this.group.nameAr?.trim() && this.group.nameEn?.trim()) {
      if (this.group.id) {
        this._groupService.setControllerName('Group');
        this._groupService
          .update(this.group as any)
          .pipe(
            catchError((error) => {
              this.isLoading = false;
              this._alertService.fail(error.message);
              return [];
            }),
          )
          .subscribe((result) => {
            const updatedIndex = this.groups.findIndex((c) => c.id === this.group.id);
            if (updatedIndex !== -1 && result.code == +ResponseCode.Success) {
              this._alertService.success(result.message);
              this.groups[updatedIndex] = result.body as any;
              this.groupDialog = false;
              this.submitted = true;
              this.group = {} as Groups;
            } else {
              this._alertService.fail(result.message);
            }
            this.isLoading = false;
          });
      } else {
        this._groupService.setControllerName('Group/ByTrainerId');
        this._groupService
          .add(this.group as any)
          .pipe(
            catchError((error) => {
              this.isLoading = false;
              this._alertService.fail(error.message);
              return [];
            }),
          )
          .subscribe({
            next: (result) => {
              if (result.code == +ResponseCode.Success) {
                this._alertService.success(result.message);
                this.groups.push(result.body as any);
                this.submitted = true;
                this.group = {} as Groups;
                this.groupDialog = false;
              } else {
                this._alertService.fail(result.message);
              }
              this.isLoading = false;
            },
          });
      }
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  isValid() {
    if(!this.group.nameAr || !this.group.nameEn) return false;
    return true;
  }
}

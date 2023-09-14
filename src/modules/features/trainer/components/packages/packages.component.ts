import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AlertService } from 'src/core/services/alert.service';
import { GenericService } from 'src/core/services/generic.service';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { Packages } from '../../interfaces/packages.interface';
import { Table } from 'primeng/table';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { ActivatedRoute } from '@angular/router';
import { Colors } from 'src/modules/shared/enums/colors.enum';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
})
export class PackagesComponent implements OnInit {
  _trainerId = '';
  _idToBeDeleted: number = 0;
  colorsOptions = [
    {
      label: this._translate.instant('labels.red'),
      value: Colors.red,
    },
    {
      label: this._translate.instant('labels.blue'),
      value: Colors.blue,
    },
    {
      label: this._translate.instant('labels.lighGrey'),
      value: Colors.lightGrey,
    },
    {
      label: this._translate.instant('labels.black'),
      value: Colors.black,
    },
  ];
  breadcrumbItems: MenuItem[] = [];
  packageDialog: boolean = false;
  deletePackageDialog: boolean = false;
  packages: Packages[] = [];
  package: Packages = {} as Packages;
  submitted: boolean = false;
  columns: any[] = [];
  textColumns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _packageService: GenericService<Packages[]>,
    public permissionClaimService: PermissionClaimsService,
    private _translate: TranslateService,
  ) {}
  ngOnInit(): void {
    this.initComponent(); 
    this._translate.onLangChange.subscribe(_ => {
      this.initComponent();
    })
    this._activatedRoute.queryParams.subscribe((param) => {
      this._trainerId = param['id'] || 0;
      this._packageService.setControllerName('Packages/TrainerPackage');
      this._packageService
        .getById(this._trainerId)

        .subscribe((result) => {
          if (result.code == +ResponseCode.Success) {
            this.packages = result.body;
            this._alertService.success(result.message);
          } else {
            this._alertService.fail(result.message);
          }
        });
    });
  }

  openNew() {
    this.submitted = false;
    this.packageDialog = true;
  }

  editPackage(packageToBeUpdated: Packages) {
    this.packageDialog = true;
    this.package = packageToBeUpdated;
  }

  deletePackage(pckg: Packages) {
    this._idToBeDeleted = pckg.id ?? 0;
    this.package = {} as Packages;
    this.deletePackageDialog = true;
  }

  confirmDelete() {
    this._packageService.setControllerName('Packages');
    if (this._idToBeDeleted)
      this._packageService.delete(this._idToBeDeleted).subscribe((result) => {
        if (result.code == ResponseCode.Success) {
          const deletedIndex = this.packages.findIndex((c) => c.id == this._idToBeDeleted);
          if (deletedIndex !== -1) {
            this.packages.splice(deletedIndex, 1);
            this._idToBeDeleted = 0;
            this._alertService.success(result.message);
          }
        } else {
          this._alertService.fail(result.message);
        }
      });
    this.deletePackageDialog = false;
  }

  hideDialog() {
    this.packageDialog = false;
    this.package = {} as Packages;
  }

  savePackage() {
    if (this.package.nameAr?.trim() && this.package.nameEn?.trim()) {
      if (this.package.id) {
        this._packageService.setControllerName('Packages');
        this._packageService
          .update(this.package as any)
          .pipe(
            catchError((error) => {
              this._alertService.fail(error.message);
              return [];
            }),
          )
          .subscribe((result) => {
            const updatedIndex = this.packages.findIndex((c) => c.id === this.package.id);
            if (updatedIndex !== -1 && result.code == +ResponseCode.Success) {
              this._alertService.success(result.message);
              this.packages[updatedIndex] = result.body as any;
              this.packageDialog = false;
              this.submitted = true;
              this.package = {} as Packages;
            } else {
              this._alertService.fail(result.message);
            }
          });
      } else {
        this.package.trainerId = this._trainerId;
        this._packageService.setControllerName('Packages');
        this._packageService
          .add(this.package as any)
          .pipe(
            catchError((error) => {
              this._alertService.fail(error.message);
              return [];
            }),
          )
          .subscribe({
            next: (result) => {
              if (result.code == +ResponseCode.Success) {
                this._alertService.success(result.message);
                this.packages.push(result.body as any);
                this.submitted = true;
                this.package = {} as Packages;
                this.packageDialog = false;
              } else {
                this._alertService.fail(result.message);
              }
            },
          });
      }
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  isValid() {
    if (!this.package.breifAr || !this.package.breifEn || !this.package.day || !this.package.price || !this.package.color) return false;
    else return true;
  }
  private initComponent() {
    this.columns = [];
    this.colorsOptions = [];
    this.columns = [
      { field: 'id', header: this._translate.instant('table.columns.id'), sortable: true },
      { field: 'nameEn', header: this._translate.instant('table.columns.name'), sortable: true },
      { field: 'price', header: this._translate.instant('table.columns.price'), sortable: true },
      { field: 'day', header: this._translate.instant('table.columns.day'), sortable: true },
      { field: 'actions', header: '' },
    ];
    this.textColumns = this.columns.filter((col) => !(col.field === 'actions'));

    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.dashboard'), routerLink: '/' });
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.packages') });
    this.colorsOptions = [
      {
        label: this._translate.instant('labels.red'),
        value: Colors.red,
      },
      {
        label: this._translate.instant('labels.blue'),
        value: Colors.blue,
      },
      {
        label: this._translate.instant('labels.lighGrey'),
        value: Colors.lightGrey,
      },
      {
        label: this._translate.instant('labels.black'),
        value: Colors.black,
      },
    ];
  }
}

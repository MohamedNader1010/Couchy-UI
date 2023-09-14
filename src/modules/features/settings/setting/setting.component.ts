import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Settings } from '../interfaces/setttings.interface';
import { Table } from 'primeng/table';
import { GenericService } from 'src/core/services/generic.service';
import { AlertService } from 'src/core/services/alert.service';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { PermissionClaims } from 'src/modules/shared/enums/permissionClaims.enum';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { UpdateLogoService } from 'src/core/services/update-logo.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  selectedFile: File | null = null;
  isLoading = false;
  claim: any;
  breadcrumbItems: MenuItem[] = [];
  settings: Settings[] = [];
  columns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  textColumns: any[] = [];
  settingDialog: boolean = false;
  submitted: boolean = false;
  setting: Settings = {} as Settings;

  constructor(
    private _settingService: GenericService<Settings>,
    private _alertService: AlertService,
    private _permissionService: PermissionClaimsService,
    private _updateLogoService: UpdateLogoService,
    private _translate: TranslateService,
  ) {
    this.claim = this._permissionService.getPermission(PermissionClaims.SettingPermission);
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.dashboard'), routerLink: '/' });
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.settings') });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._settingService.setControllerName('ApplicationSetting');
    this._settingService.getAll().subscribe((result) => {
      if (result.code == ResponseCode.Success) {
        this.setting = result.body;
      } else {
        this._alertService.fail(result.message);
      }
      this.isLoading = false;
    });
  }

  onSubmit() {
    this.isLoading = true;
    this._settingService.setControllerName('ApplicationSetting');
    this._settingService.updateWithFormData(this.setting as any, this.selectedFile, 'image').subscribe((result: any) => {
      if (result && result.body) {
        if (result.body.code == ResponseCode.Success) {
          this._alertService.success(this._translate.instant('breadcrumb.updating'));
          this._updateLogoService.updateLogoPath();
        } else {
          this._alertService.fail(result.body.message);
        }
      }
      
      this.selectedFile  = null;
      this.isLoading = false;
    });
  }
  onFileSelect(file: File) {
    this.selectedFile = file;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  isValid() {
    if(!this.setting.phone || !this.setting.phone.match("^\+965\d{7}$")) {
      return false; 
    }
    return true;
  }
}

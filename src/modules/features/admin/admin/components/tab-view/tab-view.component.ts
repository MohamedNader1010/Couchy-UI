import { PermissionClaims } from './../../../../../shared/enums/permissionClaims.enum';
import { PermissionEntry } from './../../../../../shared/interfaces/permissionsEntry';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminDto } from '../../interfaces/admin';
import { TranslateService } from '@ngx-translate/core';

type EmittedValue = { [key: number]: PermissionEntry }[];
@Component({
  selector: 'tabs',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.scss'],
})
export class TabViewComponent implements OnInit {
  claims: any[] = [];
  constructor(private _translate: TranslateService) {}
  ngOnInit(): void {
    this.claims = [
      {
        key: +PermissionClaims.CategoriesPermission,
        claim: {
          canAdd: false,
          canDelete: false,
          canUpdate: false,
          canGet: false,
        },
      },

      {
        key: +PermissionClaims.BanarPermission,
        claim: {
          canAdd: false,
          canDelete: false,
          canUpdate: false,
          canGet: false,
        },
      },
      {
        key: +PermissionClaims.MessagePermission,
        claim: {
          canAdd: false,
          canDelete: false,
          canUpdate: false,
          canGet: false,
        },
      },
      {
        key: +PermissionClaims.AdminPermission,
        claim: {
          canAdd: false,
          canDelete: false,
          canUpdate: false,
          canGet: false,
        },
      },
      {
        key: +PermissionClaims.SettingPermission,
        claim: {
          canAdd: false,
          canDelete: false,
          canUpdate: false,
          canGet: false,
        },
      },
      {
        key: +PermissionClaims.TrainerPermission,
        claim: {
          canAdd: false,
          canDelete: false,
          canUpdate: false,
          canGet: false,
        },
      },
      {
        key: +PermissionClaims.UserPermission,
        claim: {
          canAdd: false,
          canDelete: false,
          canUpdate: false,
          canGet: false,
        },
      },
    ];
    if (this.admin && this.admin.id && this.admin.permissions) {
      this.fillPermission(this.admin.permissions);
    } else {
      this.admin.permissions = this.claims;
    }
  }

  @Input('admin') admin!: AdminDto;
  @Output() permissionsChanged = new EventEmitter<{ [key: number]: PermissionEntry }[]>();

  permissions = [
    {
      key: PermissionClaims.CategoriesPermission,
      header: this._translate.instant('category.title'),
    },
    {
      key: PermissionClaims.BanarPermission,
      header: this._translate.instant('banar.title'),
    },
    {
      key: PermissionClaims.AdminPermission,
      header: this._translate.instant('admin.title'),
    },
    {
      key: PermissionClaims.UserPermission,
      header: this._translate.instant('user.title'),
    },
    {
      key: PermissionClaims.TrainerPermission,
      header: this._translate.instant('trainer.title'),
    },
    {
      key: PermissionClaims.SettingPermission,
      header: this._translate.instant('setting.title'),
    },
    {
      key: PermissionClaims.MessagePermission,
      header: this._translate.instant('message.title'),
    },
  ];

  claimByKey(key: PermissionClaims) {
    return this.claims.find((c) => c.key === key)?.claim;
  }

  fillPermission(permission: any) {
    const parsedPermissions = JSON.parse(permission);
    this.claims.forEach((cl) => {
      const claim = parsedPermissions[cl.key];
      if (claim) {
        cl.claim.canAdd = claim.CanAdd;
        cl.claim.canGet = claim.CanGet;
        cl.claim.canDelete = claim.CanDelete;
        cl.claim.canUpdate = claim.CanUpdate;
      }
    });
  }
  convertClaimsToObjectArray(): { [key: number]: PermissionEntry }[] {
    return this.claims.reduce((result, claim) => {
      result.push({ [claim.key]: claim.claim });
      return result;
    }, []);
  }
  updatePermission() {
    const convertedClaims = this.convertClaimsToObjectArray();
    this.permissionsChanged.emit(convertedClaims);
  }
}

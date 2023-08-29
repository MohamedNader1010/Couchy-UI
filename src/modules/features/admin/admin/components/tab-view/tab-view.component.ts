import { PermissionClaims } from './../../../../../shared/enums/permissionClaims.enum';
import { PermissionEntry } from './../../../../../shared/interfaces/permissionsEntry';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminDto } from '../../interfaces/admin';

type EmittedValue = { [key: number]: PermissionEntry }[];
@Component({
  selector: 'tabs',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.scss'],
})
export class TabViewComponent implements OnInit {
  claims: any[] = [];
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
    console.log(this.admin)
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
      header: 'Categories',
    },
    {
      key: PermissionClaims.BanarPermission,
      header: 'Banars',
    },
    {
      key: PermissionClaims.AdminPermission,
      header: 'Admins',
    },
    {
      key: PermissionClaims.UserPermission,
      header: 'Users',
    },
    {
      key: PermissionClaims.TrainerPermission,
      header: 'Trainers',
    },
    {
      key: PermissionClaims.SettingPermission,
      header: 'Settings',
    },
    {
      key: PermissionClaims.MessagePermission,
      header: 'Messages',
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

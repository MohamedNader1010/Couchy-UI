import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { LayoutService } from 'src/modules/layout/layout-service.service';
import { PermissionClaims } from '../../enums/permissionClaims.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];
  items: any[] = [];
  constructor(public layoutService: LayoutService, private _permissionClaimService: PermissionClaimsService) {
   
  }

  ngOnInit() {
    this.prepareItems();
    this.model = [
      {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }],
      },
      {
        label: 'Pages',
        items: this.items,
      },
    ];
  }

  public prepareItems() {
    if (this._permissionClaimService.canAccessModule(PermissionClaims.CategoriesPermission)) this.items.push({ label: 'Categories', icon: 'pi pi-fw pi-list', routerLink: ['/admin/categories'] });
    if (this._permissionClaimService.canAccessModule(PermissionClaims.BanarPermission)) this.items.push({ label: 'Banars', icon: 'pi pi-fw pi-images', routerLink: ['/admin/banars'] });
    if (this._permissionClaimService.canAccessModule(PermissionClaims.TrainerPermission)) this.items.push({ label: 'Trainers', icon: 'pi pi-fw pi-users', routerLink: ['/admin/trainers'] });
    if (this._permissionClaimService.canAccessModule(PermissionClaims.UserPermission)) this.items.push({ label: 'Users', icon: 'pi pi-fw pi-users', routerLink: ['/admin/users'] });
    if (this._permissionClaimService.canAccessModule(PermissionClaims.MessagePermission)) this.items.push({ label: 'Messages', icon: 'pi pi-fw pi-envelope', routerLink: ['/admin/messages'] });
    if (this._permissionClaimService.canAccessModule(PermissionClaims.SettingPermission)) this.items.push({ label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/admin/settings'] });
    if (this._permissionClaimService.canAccessModule(PermissionClaims.AdminPermission)) this.items.push({ label: 'Admins', icon: 'pi pi-fw pi-users', routerLink: ['/admin/admins'] });
    this.items.push({ label: 'Profiles', icon: 'pi pi-user', routerLink: ['/admin/profile'] });
  }
}

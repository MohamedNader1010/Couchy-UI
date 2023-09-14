import { OnInit, NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { LayoutService } from 'src/modules/layout/layout-service.service';
import { PermissionClaims } from '../../enums/permissionClaims.enum';
import { TranslateService } from '@ngx-translate/core';
import { LanguageEnum } from '../../enums/languages.enums';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];
  items: any[] = [];
  constructor(public layoutService: LayoutService, private _permissionClaimService: PermissionClaimsService, private _translate: TranslateService) {
    
  }

  ngOnInit() {
    this._translate.onLangChange.subscribe(event => {
      this.items = [];
      this.model = [];
      this.model = [
        {
          label: this._translate.instant('labels.home'),
          items: [{ label: this._translate.instant('breadcrumb.dashboard'), icon: 'pi pi-fw pi-home', routerLink: ['/'] }],
        },
        {
          label: this._translate.instant('labels.page'),
          items: this.items,
        },
      ];
      this.prepareItems();
    })

    this.model = [
      {
        label: this._translate.instant('labels.home'),
        items: [{ label: this._translate.instant('breadcrumb.dashboard'), icon: 'pi pi-fw pi-home', routerLink: ['/'] }],
      },
      {
        label: this._translate.instant('labels.page'),
        items: this.items,
      },
    ];
    this.prepareItems();
   
  }

  public prepareItems() {
    if (this._permissionClaimService.canAccessModule(PermissionClaims.CategoriesPermission)) this.items.push({ label: this._translate.instant('category.title'), icon: 'pi pi-fw pi-list', routerLink: ['/admin/categories'] });
    if (this._permissionClaimService.canAccessModule(PermissionClaims.BanarPermission)) this.items.push({ label: this._translate.instant('banar.title'), icon: 'pi pi-fw pi-images', routerLink: ['/admin/banars'] });
    if (this._permissionClaimService.canAccessModule(PermissionClaims.TrainerPermission)) this.items.push({ label: this._translate.instant('trainer.title'), icon: 'pi pi-fw pi-users', routerLink: ['/admin/trainers'] });
    if (this._permissionClaimService.canAccessModule(PermissionClaims.UserPermission)) this.items.push({ label: this._translate.instant('user.title'), icon: 'pi pi-fw pi-users', routerLink: ['/admin/users'] });
    if (this._permissionClaimService.canAccessModule(PermissionClaims.MessagePermission)) this.items.push({ label: this._translate.instant('message.title'), icon: 'pi pi-fw pi-envelope', routerLink: ['/admin/messages'] });
    if (this._permissionClaimService.canAccessModule(PermissionClaims.SettingPermission)) this.items.push({ label: this._translate.instant('setting.title'), icon: 'pi pi-fw pi-cog', routerLink: ['/admin/settings'] });
    if (this._permissionClaimService.canAccessModule(PermissionClaims.AdminPermission)) this.items.push({ label: this._translate.instant('admin.title'), icon: 'pi pi-fw pi-users', routerLink: ['/admin/admins'] });
    if(this._permissionClaimService.canAccessModule(PermissionClaims.AdminPermission)) this.items.push({label: this._translate.instant('notification.title'), icon: 'pi pi-fw pi-bell', routerLink: ['/admin/notifications']})
    this.items.push({ label: this._translate.instant('profile.title'), icon: 'pi pi-user', routerLink: ['/admin/profile'] });
  }
}

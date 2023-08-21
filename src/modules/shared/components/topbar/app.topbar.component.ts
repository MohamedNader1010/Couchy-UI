import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/core/services/auth.service';

import { LayoutService } from 'src/modules/layout/layout-service.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
  confirmLogoutDialog: boolean = false;
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: LayoutService, private _authService: AuthService, private _router: Router) {}

  confirmLogout() {
    this._authService.clearSession(); 
    this.confirmLogoutDialog = false; 
    this._router.navigate(['/auth/login'])
  }
  logout() {
    this.confirmLogoutDialog = true;
  }
  openThemesPallete() {}
}

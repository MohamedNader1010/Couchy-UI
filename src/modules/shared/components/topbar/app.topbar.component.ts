import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { LayoutService } from '../../../layout/layout-service.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
  name: string = '';
  confirmLogoutDialog: boolean = false;
  items!: MenuItem[];
  languageOptions: { label: string; value: string }[] = [
    { label: 'English', value: 'en' },
    { label: 'عربى', value: 'ar' },
  ];
  selectedLanguage: string = '';
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: LayoutService, private _authService: AuthService, private _router: Router) {
    this.name = this._authService.getUserName();
  }

  confirmLogout() {
    this._authService.clearSession();
    this.confirmLogoutDialog = false;
    this._router.navigate(['/auth/login']);
  }
  logout() {
    this.confirmLogoutDialog = true;
  }
  openThemesPallete() {}
}

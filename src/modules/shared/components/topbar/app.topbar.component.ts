import { UpdateProfileService } from './../../../../core/services/update-profile.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { LayoutService } from '../../../layout/layout-service.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UpdateLogoService } from 'src/core/services/update-logo.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit {
  defaulImagePath = 'assets/layout/images/defaultProfile.jpeg';
  defaultLogoPath = 'assets/layout/images/defaultLogo.png';
  logoPath: string | null = '';
  profilePath: string | null = null;
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

  constructor(
    public layoutService: LayoutService,
    private _authService: AuthService,
    private _router: Router,
    private _updateLogoService: UpdateLogoService,
    private _updateProfileService: UpdateProfileService,
  ) {
    this.name = this._authService.getUserName();
  }
  ngOnInit(): void {
    this._updateLogoService.updateLogoPath();
    this._updateProfileService.updateProfilePath();
    this._updateProfileService.profilePath$.subscribe((newProfilePath) => {
      this.profilePath = newProfilePath;
    });
    this._updateLogoService.logoPath$.subscribe((newImagePath) => {
      this.logoPath = newImagePath;
    });
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

import { Component, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from 'src/core/services/auth.service';
import { LanguageService } from 'src/core/services/language.service';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { LanguageDto } from 'src/modules/shared/components/language/interfaces/language.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private _translate: TranslateService,
    private _titleService: Title,
    private _permissionService: PermissionClaimsService,
    private _renderer: Renderer2,
    private _languageService: LanguageService,
    private _authService: AuthService,
  ) {
   
  }

  ngOnInit() {
    this._permissionService.setPermissionClaims();
    this._translate.setDefaultLang('en');
    this.primengConfig.ripple = true;
    this.setLanguage();
    this.setTitle();
    this.setStyle();
    this.onLanguageChanged();
  }

  // this is for setting title in the tab of the browser
  // as the index page is not a part of angular application,
  // so we can't use tranlsate package there.
  private setTitle() {
    this._translate.get('title').subscribe((translatedTitle: string) => {
      this._titleService.setTitle(translatedTitle);
    });
  }
  private setLanguage() {
    const lang = this._languageService.getLanguage();
    if (lang) {
      this._translate.use(lang);
    }
  }
  private onLanguageChanged() { 
    
    this._translate.onLangChange.subscribe((event) => {
      this.setTitle();
      this.setDirection();
      this.setStyle();
      this._languageService.updateLanguage({ userId: this._authService.getUserId(), language: this._languageService.currentLanguageEnum } as LanguageDto);
    });
  }
  private setDirection() {
    const currentLang = this._translate.currentLang;
    // Set the 'dir' attribute based on the language
    const htmlElement = document.getElementsByTagName('html')[0];
    if (currentLang === 'ar') {
      this._renderer.setAttribute(htmlElement, 'dir', 'rtl');
    } else {
      this._renderer.setAttribute(htmlElement, 'dir', 'ltr');
    }
  }
  private setStyle() {
    const styleLink = document.getElementById('app-style') as any;
    const currentLang = this._translate.currentLang;
    if (styleLink) {
      if (currentLang === 'ar') {
        styleLink.href = 'assets/layout/rtl-styles/layout/layout-rtl.css';
      } else {
        styleLink.href = 'assets/layout/styles/layout/layout.css';
      }
    }
  }
}

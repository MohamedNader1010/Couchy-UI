import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private primengConfig: PrimeNGConfig, private _translate: TranslateService, private _titleService: Title, private _permissionService: PermissionClaimsService) {
    this._permissionService.setPermissionClaims();
    _translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.setTitle();
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
  private onLanguageChanged() {
    this._translate.onLangChange.subscribe((event) => {
      this.setTitle();
    });
  }
}

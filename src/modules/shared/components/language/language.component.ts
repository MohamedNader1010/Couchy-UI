import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
})
export class LanguageComponent {
  ddlIcon = 'pi pi-flag';
  languageOptions: { label: string; value: string; }[] = [
    { label: 'English', value: 'en' },
    { label: 'عربي', value: 'ar' },
  ];
  selectedLanguage: string = '';

  constructor(private _tranlsateService: TranslateService) {
    this.selectedLanguage = this._tranlsateService.currentLang;
  }

  changeLanguage() {
    this._tranlsateService.use(this.selectedLanguage);
  }
}

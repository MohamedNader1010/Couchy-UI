import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericService } from './generic.service';
import { LanguageDto } from 'src/modules/shared/components/language/interfaces/language.interface';
import { LanguageEnum } from 'src/modules/shared/enums/languages.enums';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private _translate: TranslateService, private _langService: GenericService<LanguageDto>) {}

  get currentLanguage(): string {
    return this._translate.currentLang;
  }
  get isEnglish(): boolean {
    return this.currentLanguage === 'en';
  }
  get currentLanguageEnum(): number {
    return this.isEnglish ? LanguageEnum.English : LanguageEnum.Arabic;
  }
  public updateLanguage(languageModel: LanguageDto) {
    localStorage.clear();
    this.setLanguage(languageModel.language);
    this._langService.setControllerName('User/UpdateLang');
    this._langService.update(languageModel).subscribe((_) => {});
  }
  private getLanguageText(lang: number): string {
    return lang == LanguageEnum.Arabic ? 'ar' : 'en';
  }
  public setLanguage(language: LanguageEnum) {
    localStorage.setItem('lang', language.toString());
    this._translate.use(this.getLanguageText(language))
  }
  public getLanguage(): string {
    const lang = localStorage.getItem('lang');
    if (lang) return this.getLanguageText(+lang);
    return 'en';
  }
}

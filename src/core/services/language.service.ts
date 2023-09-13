import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericService } from './generic.service';
import { LanguageDto } from 'src/modules/shared/components/language/interfaces/language.interface';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { LanguageEnum } from 'src/modules/shared/enums/languages.enums';

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
    this._langService.setControllerName('User/UpdateLang');
    this._langService.update(languageModel).subscribe((_) => {});
  }
}

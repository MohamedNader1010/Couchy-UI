import { Injectable, OnInit } from '@angular/core';
import { GenericService } from './generic.service';
import { Settings } from 'src/modules/features/settings/interfaces/setttings.interface';
import { BehaviorSubject } from 'rxjs';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';

@Injectable({
  providedIn: 'root',
})
export class UpdateLogoService implements OnInit {
  private logoImagePathSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  logoPath$ = this.logoImagePathSubject.asObservable();

  constructor(private _settingService: GenericService<Settings>) {}

  ngOnInit(): void {}

  updateLogoPath() {
    this._settingService.setControllerName('ApplicationSetting');
    this._settingService.getAll().subscribe((result) => {
      if (result && result.code == ResponseCode.Success) {
        const imagePath = result.body.filePath;
        this.logoImagePathSubject.next(imagePath);
      }
    });
  }
}

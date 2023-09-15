import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FileUpload } from 'primeng/fileupload';
import { catchError } from 'rxjs';
import { AlertService } from 'src/core/services/alert.service';
import { AuthService } from 'src/core/services/auth.service';
import { GenericService } from 'src/core/services/generic.service';
import { UpdateProfileService } from 'src/core/services/update-profile.service';
import { Genders } from 'src/modules/shared/enums/genders.enum';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { Users } from 'src/modules/shared/interfaces/users.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  selectedFile: File | null = null;
  isLoading = false;
  admin: Users = {} as Users;
  submitted: boolean = false;
  genderOptions: any[] = [];
  constructor(
    private _authService: AuthService,
    private _userService: GenericService<Users>,
    private _alertService: AlertService,
    private _updateProfileService: UpdateProfileService,
    private _translate: TranslateService,
  ) {}
  ngOnInit(): void {
    this._translate.onLangChange.subscribe((_) => {
      this.initComponent();
    });
    this.initComponent();
    this.isLoading = true;
    this._userService.setControllerName('User/UserById');
    const id = this._authService.getUserId();
    this._userService.getByIdWithSlash(id)
    .pipe(catchError((error) => {
      this._alertService.fail(error.message);
      return [];
    }))
    .subscribe((result) => {
      if (result.code === +ResponseCode.Success) {
        this.admin = result.body;
        if (this.admin.filePath == null) {
          this.admin.filePath = '';
        }
      } else {
        this._alertService.fail(result.message);
      }
      this.isLoading = false;
    });
  }

  cancelImageSelection() {
    this.selectedFile = null;
    this.fileUpload.clear();
  }
  onFileSelect(file: File) {
    this.selectedFile = file;
  }
  updateUser() {
    this.isLoading = true;
    this._userService.setControllerName('User/EditUser');
    this._userService
      .updateWithFormData(this.admin, this.selectedFile, 'image')
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          this._alertService.fail(error.message);
          return [];
        }),
      )
      .subscribe((result: any) => {
        if (result && result.body) {
          if (result.body.code === +ResponseCode.Success) {
            this.admin = result.body.body;
            this._alertService.success(result.message);
            this._updateProfileService.updateProfilePath();
          } else {
            this._alertService.fail(result.message);
          }
          this.isLoading = false;
        }
      });
  }
  isValid() {
    if (!this.admin.name || !this.admin.email || !this.admin.mobileNumber) {
      return false;
    } else {
      return true;
    }
  }
  private initComponent() {
    this.genderOptions = [];
    this.genderOptions = [
      { label: this._translate.instant('labels.male'), value: Genders.Male },
      { label: this._translate.instant('labels.female'), value: Genders.Female },
    ];
  }
}

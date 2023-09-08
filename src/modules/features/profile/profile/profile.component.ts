import { Component, OnInit } from '@angular/core';
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
  selectedFile: File | null = null;
  isLoading = false;
  admin: Users = {} as Users;
  submitted: boolean = false;
  genderOptions = [
    { label: 'Male', value: Genders.Male },
    { label: 'Female', value: Genders.Female },
  ];
  constructor(private _authService: AuthService, private _userService: GenericService<Users>, private _alertService: AlertService, private _updateProfileService: UpdateProfileService) {}
  ngOnInit(): void {
    this.isLoading = true;
    this._userService.setControllerName('User/UserById');
    const id = this._authService.getUserId();
    this._userService.getById(id).subscribe((result) => {
      if (result.code === +ResponseCode.Success) {
        this.admin = result.body;
      } else {
        this._alertService.fail(result.message);
      }
      this.isLoading = false;
    });
  }

  onFileSelect(file: File) {
    this.selectedFile = file;
  }
  updateUser() {
    this.isLoading = true;
    this._userService.setControllerName('User/EditUser');
    this._userService.updateWithFormData(this.admin, this.selectedFile, 'image').subscribe((result: any) => {
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
}

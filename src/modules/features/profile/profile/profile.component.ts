import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertService } from 'src/core/services/alert.service';
import { AuthService } from 'src/core/services/auth.service';
import { GenericService } from 'src/core/services/generic.service';
import { Genders } from 'src/modules/shared/enums/genders.enum';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { Users } from 'src/modules/shared/interfaces/users.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  admin: Users = {} as Users;
  submitted: boolean = false;
  genderOptions = [
    { label: 'Male', value: Genders.Male },
    { label: 'Female', value: Genders.Female },
  ];
  constructor(private cdRef: ChangeDetectorRef, private _authService: AuthService, private _userService: GenericService<Users>, private _alertService: AlertService) {}
  ngOnInit(): void {
    this._userService.setControllerName('User/UserById');
    const id = this._authService.getUserId();
    this._userService.getById(id).subscribe((result) => {
      if (result.code === +ResponseCode.Success) {
        this.admin = result.body;
        this.cdRef.detectChanges();
      } else {
        this._alertService.fail(result.message);
      }
    });
  }

  onFileSelect(file: File) {
    this.admin.image = file;
  }
  updateUser() {
    this._userService.setControllerName('User/EditUser');
    this._userService.update(this.admin).subscribe((result) => {
      if (result.code === +ResponseCode.Success) {
        this.admin = result.body;
        this._alertService.success(result.message);
      } else {
        this._alertService.fail(result.message);
      }
    });
  }
}

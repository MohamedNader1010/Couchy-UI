import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Users } from 'src/modules/shared/interfaces/users.interface';
import { GenericService } from './generic.service';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateProfileService implements OnInit {
  private _userId = ""; 
  private profileImagePathSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  profilePath$ = this.profileImagePathSubject.asObservable();

  constructor(private _userService: GenericService<Users>, private _authService: AuthService) {}

  ngOnInit(): void {
   
  }

  updateProfilePath() {
    this._userService.setControllerName('User/UserById');
    this._userId = this._authService.getUserId()
    this._userService.getByIdWithSlash(this._userId).subscribe((result) => {
      if (result && result.code == ResponseCode.Success) {
        const imagePath = result.body.filePath ?? '';
        this.profileImagePathSubject.next(imagePath);
      }
    });
  }
}

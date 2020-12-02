import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interface/user';
import { AccountInfoProviderService } from './dataprovider.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoProviderService {

  checkLoggedObseveralbe: Observable<Boolean>;
  currentLoggedUserInfo: User = null;

  constructor(private accountInfoProvider: AccountInfoProviderService) { }

  /*
  Function name:
    retrieveUserInfoAsync
  Description:
    Return User data if the user has been logged into the system
  */
  retrieveUserInfoAsync(): Observable<Boolean> {
    this.checkLoggedObseveralbe = new Observable(
      observer => {
        this.accountInfoProvider.getLoggedUserInfo().subscribe(
          (result) => {
            if ((result === "Not logged") || (result === "User not found")) {
              this.currentLoggedUserInfo = null;
            }
            else {
              this.currentLoggedUserInfo = <User>JSON.parse(<string>result);
            }
            observer.next();
            console.log("retrieveUserInfoAsync,OK:" + result);
          },
          (error) => {
            observer.next();
            console.log("retrieveUserInfoAsync,ERROR:" + error);
          }
        )
      }
    )
    return this.checkLoggedObseveralbe;
  }

  /*
  Function name:
    isUserLogged
  Description:
    Return True if user logged into the system
  */
  isUserLogged(): Boolean {
    if (this.currentLoggedUserInfo) {
      return true;
    }
    else {
      return false;
    }
  }
  /*
  Function name:
    isUserAdmin
  Description:
    Return True if user is an admin
  */
  isUserAdmin(): Boolean {
    if (this.currentLoggedUserInfo.is_admin) {
      return true;
    }
    else {
      return false;
    }
  }

  /*
   Function name:
     setCurrentUser
   Description:
     Return True if user is an admin
   */
  setCurrentUser(user: User): void {
    this.currentLoggedUserInfo = user;
  }
}

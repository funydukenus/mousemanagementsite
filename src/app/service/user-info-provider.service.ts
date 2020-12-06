import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interface/user';
import { AccountInfoProviderService, ResponseFrame } from './dataprovider.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoProviderService {

  checkLoggedObseveralbe: Observable<Boolean>;
  checkUserNumObseveralbe: Observable<Boolean>;
  currentLoggedUserInfo: User = null;

  isUserListEmpty: Boolean;

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
            let responeFrame: ResponseFrame = <ResponseFrame>result;
            
            if (responeFrame.result !== 0) {
              this.currentLoggedUserInfo = <User>JSON.parse(<string>responeFrame.payload);
            }
            else {
              this.currentLoggedUserInfo = null;
            }
            observer.next();
          },
          (error) => {
            // Not handling the network error
            // Let user login again
            this.currentLoggedUserInfo = null;
            observer.next();
          }
        )
      }
    )
    return this.checkLoggedObseveralbe;
  }

  /*
  Function name:
    retrieveUserInfoAsync
  Description:
    Return User data if the user has been logged into the system
  */
  retrieveUserNumAsync(): Observable<Boolean> {
    this.checkUserNumObseveralbe = new Observable(
      observer => {
        this.accountInfoProvider.getUserNum().subscribe(
          (result) => {
            let responeFrame: ResponseFrame = <ResponseFrame>result;

            if (responeFrame.result !== 0) {
              if (responeFrame.payload == 0) {
                this.isUserListEmpty = true;
              } else {
                this.isUserListEmpty = false;
              }
            }
            else {
              this.isUserListEmpty = false;
            }
            observer.next();
          },
          (error) => {
            // Not handling the network error
            // Let user login again
            this.isUserListEmpty = false;
            observer.next();
          }
        )
      }
    )
    return this.checkUserNumObseveralbe;
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

  /*
   Function name:
     getCurrentUser
   Description:
     Return current logged user
   */
  getCurrentUser(): User {
    return this.currentLoggedUserInfo;
  }


  userListEmpty(): Boolean {
    return this.isUserListEmpty;
  }

  markListNotEmpty(): void {
    this.isUserListEmpty = false;
  }
}

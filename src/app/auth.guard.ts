import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserInfoProviderService } from './service/user-info-provider.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userInfoProviderService: UserInfoProviderService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): true | UrlTree {

    return this.checkLogin(state.url);
  }

  checkLogin(nextUrl: string): true | UrlTree {
    if (this.userInfoProviderService.isUserLogged()) {
      // If user has logged in and the next page is login page
      // direct to home page
      if (nextUrl === '/login') {
        return this.router.parseUrl('');
      }

      return true;
    }
    else {
      if (nextUrl !== '/login') {
        return this.router.parseUrl('/login');
      }
      return true;
    }
  }

}

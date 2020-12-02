import { Injectable } from '@angular/core';
import { UserInfoProviderService } from './user-info-provider.service'

@Injectable()
export class AppConfigService {

  constructor(private userInfoProviderService: UserInfoProviderService) { }

  public load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userInfoProviderService.retrieveUserInfoAsync().subscribe(
        () => {
          resolve(true);
        }
      );
    });
  }
}

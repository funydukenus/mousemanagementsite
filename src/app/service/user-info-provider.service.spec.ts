import { TestBed } from '@angular/core/testing';

import { UserInfoProviderService } from './user-info-provider.service';

describe('UserInfoProviderService', () => {
  let service: UserInfoProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInfoProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

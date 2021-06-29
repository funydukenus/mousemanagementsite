import { Component, OnInit } from '@angular/core';

// Import UI Related module
import { interval } from 'rxjs';
import { UserInfoProviderService } from '../service/user-info-provider.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {

  todayDate = new Date().toLocaleString();

  isAdmin: Boolean = false;

  constructor(private userInfoProvider: UserInfoProviderService) {
    this.isAdmin = this.userInfoProvider.isUserAdmin();
  }

  ngOnInit(): void {
    // Creates a timer to update the current datetime
    let sub = interval(1000).subscribe(x => {
      this.todayDate = new Date().toLocaleString();
    });
  }
}

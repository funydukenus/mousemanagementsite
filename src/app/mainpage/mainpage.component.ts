import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Import UI Related module
import { interval } from 'rxjs';
import { AccountInfoProviderService } from '../service/dataprovider.service';

import { EventEmiterService } from '../service/event.emmiter.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {

  todayDate = new Date().toLocaleString();

  isAdmin: Boolean = false;

  constructor(
    private _router: Router,
    private _eventEmiter: EventEmiterService,
    private accountInfoProvider: AccountInfoProviderService) {
    this._eventEmiter.informPageLoc(
      'main'
    );

    this.accountInfoProvider.IsAdmin().subscribe(
      (result) => {
        let response: String = new String(result).toString();
        if (response == "1") {
          this.isAdmin = true;
        }
      },
      (error) => {
        this.isAdmin = false;
      }
    )

  }

  ngOnInit(): void {
    // Creates a timer to update the current datetime
    let sub = interval(1000).subscribe(x => {
      this.todayDate = new Date().toLocaleString();
    });
  }

  PageDirect(target) {
    this._router.navigate([target]);
  }

  /*
  triggerGridEvent(routeLink: string): void {
     this._router.navigate([routeLink]);
  }
  */
}

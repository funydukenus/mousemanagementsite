import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Import UI Related module
import { MatGridListModule } from '@angular/material/grid-list';
import { interval, Observable } from 'rxjs';

import { EventEmiterService } from '../service/event.emmiter.service';

@Component({
   selector: 'app-mainpage',
   templateUrl: './mainpage.component.html',
   styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {

   todayDate = new Date().toLocaleString();

   constructor(
      private _router: Router,
      private _eventEmiter: EventEmiterService) {}

   ngOnInit(): void {
      
      // Creates a timer to update the current datetime
      let sub = interval(1000).subscribe(x => {
         this.todayDate = new Date().toLocaleString();
      });

      this._eventEmiter.informPageLoc('main');

   }

   harvestMouseTableDirect()
   {
      this._router.navigate(['/harvestmouse']);
   }

   /*
   triggerGridEvent(routeLink: string): void {
      this._router.navigate([routeLink]);
   }
   */
}

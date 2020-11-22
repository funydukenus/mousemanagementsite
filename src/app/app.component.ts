import { Component, ViewChild, ElementRef } from '@angular/core';
import { EventEmiterService } from './service/event.emmiter.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mousemanagementsite';

  @ViewChild('sidenav') sideNav: MatDrawer;

  constructor(
   private _eventEmiter: EventEmiterService
  ){}

  UploadClick(){
     this._eventEmiter.sendMessage();
     this.sideNav.close();
  }
}

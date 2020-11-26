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
  type:string = 'main';
  @ViewChild('sidenav') sideNav: MatDrawer;

  constructor(
   private _eventEmiter: EventEmiterService
  ){
     this._eventEmiter.pageLocIndicator.subscribe(
        data => {
          this.ModifySideBarChoice(data);
        }
     )
  }

  UploadClick(){
     this._eventEmiter.sendMessage();
     this.sideNav.close();
  }

  ModifySideBarChoice(inputType){
   this.type = inputType;
  }

  IsMainPage(){
     return this.type === 'main';
  }

  IsHarvestMousePage(){
     return this.type === 'mousetable'
  }
}

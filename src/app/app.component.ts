import { Component } from '@angular/core';
import { MainpageComponent } from './mainpage/mainpage.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mousemanagementsite';
}

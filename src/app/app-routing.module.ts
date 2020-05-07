import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { HarvestmousepageComponent } from './harvestmousepage/harvestmousepage.component';

const routes: Routes = [
  {
    path: 'home',
    component: MainpageComponent
  },
  {
    path: 'harvestmouse',
    component: HarvestmousepageComponent
  },
  {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

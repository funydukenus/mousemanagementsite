import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { HarvestmousetabpageComponent } from './harvestmousetabpage/harvestmousetabpage.component';
const routes: Routes = [
  {
    path: 'home',
    component: MainpageComponent
  },
  {
    path: 'harvestmouse',
    component: HarvestmousetabpageComponent
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

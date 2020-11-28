import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { HarvestmousetabpageComponent } from './harvestmousetabpage/harvestmousetabpage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { UpdatepwdnewuserComponent } from './updatepwdnewuser/updatepwdnewuser.component';
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';

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
      path: 'login',
      component: LoginpageComponent
   },
   {
      path: 'updatepwdnewuser',
      component: UpdatepwdnewuserComponent
   },
   {
      path: 'pagenotfound',
      component: PageNotFoundComponentComponent
   },
   {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full'
   }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }

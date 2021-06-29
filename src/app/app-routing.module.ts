import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { HarvestmousetabpageComponent } from './harvestmousetabpage/harvestmousetabpage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { UpdatepwdnewuserComponent } from './updatepwdnewuser/updatepwdnewuser.component';
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';
import { UploadcsvpageComponent } from './uploadcsvpage/uploadcsvpage.component';
import { UsermanagementpageComponent } from './usermanagementpage/usermanagementpage.component';
import { AuthGuard } from './auth.guard';
import { SiteLayoutComponent } from './_layout/site-layout/site-layout.compoenent';
import { FirstTimeUserComponent } from './first-time-user/first-time-user.component';

const routes: Routes = [
  // Site routes 
  // Includes the header
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      // { path: '', component: MainpageComponent, canActivate: [AuthGuard], pathMatch: 'full'},
      { path: '', component: HarvestmousetabpageComponent,  canActivate: [AuthGuard], pathMatch: 'full'},
      { path: 'upload-csv', component: UploadcsvpageComponent, canActivate: [AuthGuard] },
      { path: 'user-management-page', component: UsermanagementpageComponent, canActivate: [AuthGuard]  }
    ]
  },
  {
    path: 'update-pwd-new-user',
    component: UpdatepwdnewuserComponent
  },
  {
    path: 'first-time-user',
    component: FirstTimeUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginpageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponentComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
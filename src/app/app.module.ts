/* Angular Core related modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER  } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

/* Angular Material Module */
import { AngularMaterialModule } from './angular.material.module';

/* Default page component related class */
import { SiteLayoutComponent } from './_layout/site-layout/site-layout.compoenent';

/* Page Component related class*/
import { MainpageComponent } from './mainpage/mainpage.component';
import { HarvestmousepageComponent } from './harvestmousepage/harvestmousepage.component';
import { HarvestmousetabpageComponent } from './harvestmousetabpage/harvestmousetabpage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { UpdatepwdnewuserComponent } from './updatepwdnewuser/updatepwdnewuser.component';
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component';
import { UploadcsvpageComponent } from './uploadcsvpage/uploadcsvpage.component';
import { UsermanagementpageComponent } from './usermanagementpage/usermanagementpage.component';
import { DialogConfirmationComponent } from './dialog/dialog.component';
import { DialogSimpleConfirmationComponent } from './dialog/dialog.component';
import { DialogSingleEditComponent } from './dialog/dialog.component';

/* Service related class */
import { EventEmiterService } from './service/event.emmiter.service';
import { BottomSheetColSelComponent } from './service/bottomsheet.service';

/* Pipe related class*/
import { GenderConverter } from './pipe/gender.pipe';
import { TableHeaderConverter } from './pipe/tableheader.pipe';
import { AppConfigService } from './service/app-config.service';
import { FirstTimeUserComponent } from './first-time-user/first-time-user.component';

export function init_app(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    MainpageComponent,
    HarvestmousepageComponent,
    GenderConverter,
    HarvestmousetabpageComponent,
    BottomSheetColSelComponent,
    TableHeaderConverter,
    DialogConfirmationComponent,
    DialogSimpleConfirmationComponent,
    DialogSingleEditComponent,
    LoginpageComponent,
    UpdatepwdnewuserComponent,
    PageNotFoundComponentComponent,
    UploadcsvpageComponent,
    UsermanagementpageComponent,
    SiteLayoutComponent,
    FirstTimeUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ],
  providers: [
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppConfigService], multi: true },
    EventEmiterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

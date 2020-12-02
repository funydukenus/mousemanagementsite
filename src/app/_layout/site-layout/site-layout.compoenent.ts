import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AccountInfoProviderService } from 'src/app/service/dataprovider.service';
import { EventEmiterService } from 'src/app/service/event.emmiter.service';
import { UserInfoProviderService } from 'src/app/service/user-info-provider.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit {

  constructor(
    private accountInfoProvider: AccountInfoProviderService,
    private router: Router,
    private userInfoProvider: UserInfoProviderService) { }

  @ViewChild('sidenav') sidenav: MatDrawer;

  ngOnInit() {

  }

  logout() {
    this.accountInfoProvider.userLogout().subscribe(
      result => {
        this.userInfoProvider.setCurrentUser(null);
        this.router.navigate(['login']);
      },
      error => {
        console.log(error);
      }
    )
  }
}
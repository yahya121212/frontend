import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common/common.service';
import { ShareDataService } from 'src/app/core/data/share-data.service';
import { header } from 'src/app/core/models/sidebar-model';
import { Profile, url } from 'src/app/core/models/models';
import { ProfileService } from 'src/app/core/services/profile.service';
@Component({
  selector: 'app-freelancer',
  templateUrl: './freelancer.component.html',
  styleUrls: ['./freelancer.component.scss'],
})
export class FreelancerComponent {
  breadcrum = true;
  freelancer = true;
  base = '';
  page = '';
  last = '';
  url!: string;
  isLoggedIn: boolean = false;

  sidebar: Array<header> = [];
  constructor(
    private Router: Router,
    private common: CommonService,
    private profileService: ProfileService,
    private data: ShareDataService
  ) {
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
    Router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.getRoutes(event);
      }
    });
    this.getRoutes(this.Router);
  }
ngOnInit() {
     this.isLoggedIn=this.profileService.isLoggedIn()
  
}
  getRoutes(event: url) {
    const splitVal = event.url.split('/');
    this.base = splitVal[1];
    this.page = splitVal[2];
    this.last = splitVal[3];
    if (
      event.url === '/freelancer/chats' ||
      event.url === '/freelancer/project' ||
      event.url === '/freelancer/project-details' ||
      event.url === '/freelancer/candidate-profile' ||
      event.url === '/freelancer/developers-details' ||
      event.url === '/freelancer/offre-mission-interim'
    ) {
      this.freelancer = false;
      this.breadcrum = false;
    } else {
      this.freelancer = true;
      this.breadcrum = true;
    }
  }
}

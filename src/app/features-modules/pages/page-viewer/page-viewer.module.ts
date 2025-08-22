import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageViewerRoutingModule } from './page-viewer-routing.module';
import { PageViewerComponent } from './page-viewer.component';
import { LoginRoutingModule } from '../../auth/login/login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutUsRoutingModule } from '../about-us/about-us-routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    PageViewerComponent
  ],
  imports: [
    CommonModule,
    PageViewerRoutingModule,
    CommonModule, LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AboutUsRoutingModule,
    CarouselModule,
    SharedModule,
    RouterModule,
    TranslateModule,
  ]
})
export class PageViewerModule { }

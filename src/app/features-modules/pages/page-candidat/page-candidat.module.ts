import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { pageCandidatRoutingModule } from './page-candidat-routing.module';
import { pageCandidat } from './page-candidat.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    pageCandidat
  ],
  imports: [
    CommonModule,
    pageCandidatRoutingModule,
    SharedModule,
    RouterModule   // ← obligatoire pour routerLink


  ]
})
export class pageCandidatModule { }
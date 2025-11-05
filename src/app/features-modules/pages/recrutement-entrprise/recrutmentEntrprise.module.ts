import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecrutmentEntrpriseRoutingModule } from './recrutment-entrprise-routing.module';
import { RecrutmentEntrprise } from './recrutment-entrprise.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RecrutmentEntrprise
  ],
  imports: [
    CommonModule,
    RecrutmentEntrpriseRoutingModule,
    SharedModule,

  ]
})
export class RecrutmentEntrpriseModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecrutmentEntrpriseRoutingModule } from './recrutment-entrprise-routing.module';
import { RecrutmentEntrprise } from './recrutment-entrprise.component';

 
@NgModule({
  declarations: [
    RecrutmentEntrprise
  ],
  imports: [
    CommonModule,
    RecrutmentEntrpriseRoutingModule,
  ]
})
export class RecrutmentEntrpriseModule { }

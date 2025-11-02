import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

 import { RecrutmentEntrprise } from './recrutmentEntrprise';
import { RecrutmentEntrpriseRoutingModule } from './recrutment-entrprise-routing.module';

 
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

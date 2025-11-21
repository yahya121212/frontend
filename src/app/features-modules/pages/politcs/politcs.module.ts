import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolitcsRoutingModule } from './politcs-routing.module';
import { PolitcsComponent } from './politcs.component';


@NgModule({
  declarations: [
    PolitcsComponent
  ],
  imports: [
    CommonModule,
    PolitcsRoutingModule
  ]
})
export class PolitcsModule { }

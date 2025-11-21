import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolitcsComponent } from './politcs.component';

const routes: Routes = [{ path: '', component: PolitcsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolitcsRoutingModule { }

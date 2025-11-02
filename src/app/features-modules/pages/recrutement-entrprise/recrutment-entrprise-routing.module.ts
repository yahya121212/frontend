import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecrutmentEntrprise } from './recrutmentEntrprise';
 
const routes: Routes = [{ path: '', component: RecrutmentEntrprise }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecrutmentEntrpriseRoutingModule { }

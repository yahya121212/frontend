import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { pageCandidat } from './page-candidat.component';
    
const routes: Routes = [{ path: '', component: pageCandidat }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class pageCandidatRoutingModule { }

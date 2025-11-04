import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list.component';

const routes: Routes = [{ path: '',title:"Découvrez nos offres d’emploi – Rejoignez Société Intérim Online Protec", component: ProjectListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectListRoutingModule { }

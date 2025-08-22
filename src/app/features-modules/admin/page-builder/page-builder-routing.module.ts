import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageListComponent } from './page-list.component';
import { PageBuilderComponent } from './page-builder.component';

const routes: Routes = [
  { path: '', component: PageListComponent },
  { path: 'new', component: PageBuilderComponent },
  { path: ':id', component: PageBuilderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageBuilderRoutingModule {}
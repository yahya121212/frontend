import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageViewerComponent } from './page-viewer.component';

const routes: Routes = [{ path: '', component: PageViewerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageViewerRoutingModule { }

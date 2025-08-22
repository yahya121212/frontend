import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBuilderRoutingModule } from './page-builder-routing.module';
import { PageBuilderComponent } from './page-builder.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { PageListComponent } from './page-list.component';
import { NgxEditorModule } from 'ngx-editor';


@NgModule({
    declarations: [
        PageBuilderComponent,
        PageListComponent
    ],
    imports: [
        CommonModule,
        PageBuilderRoutingModule,
        ReactiveFormsModule,
        NgxEditorModule,
        FormsModule,
        DragDropModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatSelectModule,
        MatListModule,
    ]
})
export class PageBuilderModule { }

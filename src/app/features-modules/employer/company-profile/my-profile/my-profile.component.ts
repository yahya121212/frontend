import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { routes } from 'src/app/core/helpers/routes/routes';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit, OnDestroy {
  public routes = routes;
  
  public details = [];

    addDetails(array: number[]) {
      array.push(1);
    }
    deleteDetails(array: number[], index: number) {
      this.details.splice(index, 1);
    }
  
    editor!: Editor;
    toolbar: Toolbar = [
      ['bold', 'italic'],
      ['underline', 'strike'],
      ['code', 'blockquote'],
      ['ordered_list'],
      [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
      ['link', 'image'],
      ['text_color', 'background_color'],
      ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];
  
    form = new FormGroup({
      editorContent: new FormControl('', Validators.required()),
    });
  
    ngOnInit(): void {
      this.editor = new Editor();
    }
  
    ngOnDestroy(): void {
      this.editor.destroy();
    }
    constructor(private router: Router) {}
    ngsubmit(){
      this.router.navigate([routes.freelancer_projects_proposals])
    }
 
}

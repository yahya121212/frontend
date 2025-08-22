import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
type SectionType = 'title' | 'description' | 'image';
import { environment } from 'src/environments/environment';
import { Editor, Toolbar } from 'ngx-editor';
import { Component, OnDestroy, OnInit,AfterViewInit, ChangeDetectorRef } from '@angular/core';

interface SectionOptions {
    textColor: string; // <-- Ajoute cette ligne
    backgroundColor: string; // <-- Add this line
    backgroundImage: string;
    fontFamily: string;
    fontSize: number;
}

interface Section {
    type: SectionType;
    content: any;
    edit: boolean;
    options: SectionOptions;
}

@Component({
    selector: 'app-page-builder',
    templateUrl: './page-builder.component.html',
    styleUrls: ['./page-builder.component.scss']
})
export class PageBuilderComponent implements OnInit, OnDestroy {
    sections: Section[] = [];
    sectionTypes: SectionType[] = ['title', 'description', 'image'];
    private baseUrl = `http://localhost:3000/api/`; // URL to get zip codes
    updatePage() {
        if (!this.pageId) return;
        const pageData = {
            title: this.title,
            data: this.sections
        };
        const id = Number(this.pageId); // s'assurer que c’est un number

        this.http.put(`${this.baseUrl}page-builder/${id}`, pageData).subscribe({
            next: () => {
                alert('Page mise à jour avec succès !');
                this.router.navigate(['/admin/page-builder']);
            },
            error: (err) => {
                console.error('Erreur de mise à jour', err);
                alert('Erreur lors de la mise à jour');
            }
        });
        
    }
    addSection(type: SectionType) {
        let content: any = {};
        if (type === 'title') content = { text: '' };
        if (type === 'description') content = { text: '' };
        if (type === 'image') content = { url: '', alt: '' };
        this.sections.push({
            type,
            content,
            edit: true,
            options: {
                textColor: '#222222',
                backgroundColor: '', // <-- Add this line
                backgroundImage: '',
                fontFamily: "'Arial', sans-serif",
                fontSize: 18
            }
        });
    }
    title: string = ''; // Ajoute un champ pour le titre de la page

    savePage() {
        const pageData = {
            title: this.title || 'Nouvelle page',
            data: this.sections
        };
        this.http.post(`${this.baseUrl}page-builder`, pageData).subscribe({
            next: () => {
                alert('Page enregistrée avec succès !');
                this.router.navigate(['/admin/page-builder']);
            },
            error: () => alert('Erreur lors de la sauvegarde')
        });
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


ngAfterViewInit(): void {
  setTimeout(() => {
    this.cdr.detectChanges();
  }, 0);
}
    ngOnInit(): void {
        this.editor = new Editor();
    }
    ngOnDestroy(): void {
        this.editor.destroy();
    }

    drop(event: CdkDragDrop<Section[]>) {
        moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
    }

    saveSection(section: Section) {
        section.edit = false;
    }

    editSection(section: Section) {
        section.edit = true;
    }

    removeSection(index: number) {
        this.sections.splice(index, 1);
    }

    get pageJson() {
        return JSON.stringify(this.sections.map(({ edit, ...rest }) => rest), null, 2);
    }

    onBackgroundImageChange(event: any, section: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                section.options.backgroundImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
    pageId: string | null = null;

    constructor(
        private http: HttpClient,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute
    ) {
        this.route.paramMap.subscribe(params => {
            this.pageId = params.get('id');
            if (this.pageId) {
                this.http.get<any>(`${this.baseUrl}page-builder/${this.pageId}`).subscribe(page => {
                    this.title = page.title;
                    this.sections = page.data;
                });
            } else {
                this.title = '';
                this.sections = [];
            }
        });
    }
    triggerFileInput(fileInput: HTMLInputElement) {
        fileInput.click();
    }

    onSectionImageChange(event: any, section: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                section.content.url = e.target.result; // base64 string
            };
            reader.readAsDataURL(file);
        }
    }
}
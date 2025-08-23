import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-page-list',
    templateUrl: './page-list.component.html',
    styleUrls: ['./page-list.component.scss']
})
export class PageListComponent implements OnInit {
    pages: any[] = [];
    loading = false;

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit() {
        this.fetchPages();
    }
    private baseUrl = `${environment.apiUrl}`; // URL to get zip codes

    fetchPages() {
        this.loading = true;

        this.http.get<any[]>(`${this.baseUrl}/page-builder`).subscribe({
            next: (data) => { this.pages = data; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }
    getFirstTitleText(pageData: any): string | null {
        console.log('🔧 Page data:', pageData);
        const firstTitleBlock = pageData.data.find((block: any) => block.type === 'title');
        return pageData?.title ? pageData.title : firstTitleBlock ? firstTitleBlock.content?.text : null;
    }

    createNewPage() {
        this.router.navigate(['/admin/page-builder/new']);
    }

    editPage(page: any) {
        this.router.navigate(['/admin/page-builder', page.id]);
    }
    deletePage(id: any) {
        if (!id || !confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
            return;
        }

        id = Number(id);

        this.http.delete(`${this.baseUrl}/page-builder/${id}`).subscribe({
            next: () => {
                this.fetchPages();
                alert('Page supprimée avec succès !');
                this.router.navigate(['/admin/page-builder']);
            },
            error: (err) => {
                console.error('Erreur de suppression', err);
                alert('Erreur lors de la suppression');
            }
        });
    }
    savePage() {
        // Logic to save the page
    }
}
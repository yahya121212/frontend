import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public routes = routes;
  pages: any[] = [];

  dateNow: Date = new Date();
  date = this.dateNow.getFullYear();
  constructor(

    private http: HttpClient
  ) {
    this.http.get<any[]>(`${environment.apiUrl}/page-builder`).subscribe({
      next: (data) => this.pages = data
    });
  }

  getFirstTitleText(pageData: any): string | null {
    const firstTitleBlock = pageData.data.find((block: any) => block.type === 'title');
    return pageData?.title ? pageData.title : firstTitleBlock ? firstTitleBlock.content?.text : null;
  }
  goToPage(page: any) {
    // Adapte le chemin selon ta route front
    // Exemple: /page/:id
    window.location.href = `/page/${page.id}`;
    // Ou avec le router Angular si tu préfères :
    // this.router.navigate(['/page', page.id]);
  }
}

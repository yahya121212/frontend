import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from '../../auth/login/login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AboutUsRoutingModule } from '../about-us/about-us-routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-page-viewer',
  templateUrl: './page-viewer.component.html',
  styleUrls: ['./page-viewer.component.scss'],
  // imports: [CommonModule, LoginRoutingModule,
  //   FormsModule,
  //   ReactiveFormsModule,  
  //   AboutUsRoutingModule,
  //   CarouselModule,
  //   SharedModule,
  //   RouterModule,
  //   TranslateModule,],

})
export class PageViewerComponent implements OnInit {
  pageId: string | null = null;
  blocks: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pageId = id;
        this.loadPage(id);
      }
    });
  }

  private loadPage(id: string): void {
    this.http.get<any>(`http://localhost:3000/api/page-builder/${id}`).subscribe({
      next: (page) => {
        try {
          this.blocks = Array.isArray(page.data) ? page.data : JSON.parse(page.data);
        } catch (error) {
          console.error('Erreur parsing JSON data:', error);
          this.blocks = [];
        }

        console.log('🔧 Blocs de page chargés :', this.blocks);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la page :', err);
      }
    });
  }
}

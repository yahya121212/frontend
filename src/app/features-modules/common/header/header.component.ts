import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ShareDataService } from 'src/app/core/data/share-data.service';
import { routes } from 'src/app/core/helpers/routes/routes';
import { header } from 'src/app/core/models/sidebar-model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CommonService } from 'src/app/core/services/common/common.service';
import { NavbarService } from 'src/app/core/services/navbar.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @ViewChild('stickyMenu')
  menuElement!: ElementRef;
  public routes = routes;
  sticky = false;
  elementPosition: number | undefined;
  base = '';
  base1 = '';
  page = '';
  last = '';

  private publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/freelancer/project-details',
  ];

  navbar: Array<header> = [];
  public header_bg = false;
  isEmployer: boolean = false;
  pages: any[] = [];

  isMobile$: Observable<boolean>;
  constructor(
    private router: Router,
    private data: ShareDataService,
    private navservices: NavbarService,
    public authService: AuthService,
    private common: CommonService,
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient
  ) {
    this.http.get<any[]>(`${environment.apiUrl}/page-builder`).subscribe({
      next: (data) => this.pages = data
    });
    this.common.base.subscribe((res: string) => {
      this.base = res;
      this.base1 = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
    this.navbar = this.data.sideBar;

    this.isMobile$ = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map((result) => result.matches));
  }
  open() {
    console.log('open');

    this.showPagesDropdown = !this.showPagesDropdown;
  }
  


  ngOnInit(): void {

    this.checkNavigation();
    this.isEmployer = this.authService.isEmployer();
  }
  showPagesDropdown = false; // <-- Doit être false au départ


  checkNavigation() {
    const currentRoute = this.router.url;

    // Skip redirection if current route is public
    if (this.publicRoutes.some((route) => currentRoute.startsWith(route))) {
      return;
    }

    this.navigateToDash();
  } 
  navigateToDash() {
    const role = localStorage.getItem('role');
    
    if (role) {
      if (role === 'candidate') {
        this.router.navigate([routes.freelancer_dashboard]);
      } else if (role === 'admin') {
        this.router.navigate([routes.admin_dashboard]);
      } else if (role === 'company-employee') {
        this.router.navigate([routes.employee_dashboard]);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  employer() {
    localStorage.setItem('employer', 'employer');
  }

  freelancer() {
    localStorage.setItem('freelancer', 'freelancer');
  }

  otherPages(val: string) {
    localStorage.setItem(val, val);
  }

  home() {
    this.router.navigate(['/home']);
  }

  public toggleSidebar(): void {
    this.navservices.openSidebar();
  }
  public hideSidebar(): void {
    this.navservices.closeSidebar();
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (this.elementPosition && windowScroll >= this.elementPosition) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
    if (windowScroll == 0) {
      this.header_bg = false;
    } else {
      this.header_bg = true;
    }
  }
  
}


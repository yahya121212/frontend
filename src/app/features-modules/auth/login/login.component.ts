import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, take } from 'rxjs';
import { routes } from 'src/app/core/helpers/routes/routes';
import { WebStorage } from 'src/app/core/storage/web.storage';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
declare global {
  interface Window {
    google: any;
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit, OnDestroy {
  public password: boolean[] = [true];
  public routes = routes;
  public Toggledata = true;
  loginForm: FormGroup;

  public CustomControler: unknown;
  public subscription: Subscription;
  loginError: string | null = null;

  constructor(
    private storage: WebStorage,
    private translate: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private location: Location,
    private profileService: ProfileService,
    private ActivatedRoute: ActivatedRoute,
    private http: HttpClient

  ) {
    this.translate.setDefaultLang(environment.defaultLanguage);
    this.subscription = this.storage.Loginvalue.subscribe((data) => {
      if (data != '0') {
        this.CustomControler = data;
      }
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngAfterViewInit(): void {
    this.waitForGoogle(() => {
      try {
        window.google.accounts.id.initialize({
          client_id: '129135782182-1jn2nr1hpt9fqd0no108noc28gd1d19r.apps.googleusercontent.com',
          callback: (response: any) => this.handleGoogleCredential(response),
        });

        const buttonElement = document.getElementById('googleBtn');
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            theme: 'outline',
            size: 'large',
          });
        } else {
          console.warn('Google button container not found');
        }
      } catch (e) {
        console.error('Error initializing Google Sign-In:', e);
      }
    });
  }

  private waitForGoogle(callback: () => void, retries = 20): void {
    if (window.google?.accounts?.id) {
      callback();
    } else if (retries > 0) {
      setTimeout(() => this.waitForGoogle(callback, retries - 1), 150);
    } else {
      console.warn('Google API not loaded after multiple retries');
    }
  }

  private handleGoogleCredential(response: any): void {
    const idToken = response?.credential;
    if (!idToken) {
      console.error('No ID token received from Google');
      return;
    }

    this.http.post(`${environment.apiUrl}/auth/google`, { idToken })
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          console.log('Google login response:', res);
          localStorage.setItem('token', res.token || res.access_token);
          localStorage.setItem('refreshToken', res.refreshToken || res.refresh_token);
          localStorage.setItem('email', res.email);
          localStorage.setItem('role', res.role);

          this.authService.setUser(res.user);
          this.authService.setIsLoggedIn(true);
          this.profileService.profile = res.user;

          const role = res.role;
          const profile = res.user;

          if (role === 'candidate') {
            this.router.navigate(
              profile?.profileUpdatedAt ? [routes.freelancer_dashboard] : ['/pages/onboard-screen']
            );
          } else if (role === 'admin') {
            this.router.navigate([routes.admin_dashboard]);
          } else if (role === 'company-employee') {
            this.router.navigate([routes.employee_dashboard]);
          }

          this.loginError = null;
        },
        error: (err) => {
          const errorMessage = 'Vous devez vérifier votre compte. Vous avez déjà reçu un mail de vérification, veuillez vérifier votre boîte mail.';
          this.loginError = errorMessage;
          console.error('Google login error:', err);
          window.alert(errorMessage);
        }
      });
  }


  ngOnInit() {
  
     setTimeout(() => {
    this.waitForGoogle(() => {
      try {
        window.google.accounts.id.initialize({
          client_id: '129135782182-1jn2nr1hpt9fqd0no108noc28gd1d19r.apps.googleusercontent.com',
          callback: (response: any) => this.handleGoogleCredential(response),
        });

        const buttonElement = document.getElementById('googleBtn');
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            theme: 'outline',
            size: 'large',
          });
        } else {
          console.warn('Google button container not found');
        }
      } catch (e) {
        console.error('Error initializing Google Sign-In:', e);
      }
    });
  }, 0); // Wait for view to fully load
    const role = localStorage.getItem('role');
    if (role) {
      if (role === 'candidate') {
        this.router.navigate([routes.freelancer_dashboard]);
      } else if (role === 'admin') {
        this.router.navigate([routes.admin_dashboard]);
      } else if (role === 'company-employee') {
        this.router.navigate([routes.employee_dashboard]);
      } else {
        this.router.navigate(['/']); // Default route for unknown roles
      }
    }
  }
  goBack() {
    console.log('Navigating back');
    this.location.back();
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('email', response.email);
          localStorage.setItem('role', response.role);
          this.authService.setUser(response.user);
          this.authService.setIsLoggedIn(true);
          this.profileService.profile = response.user;

          if (response.role === 'candidate') {
            if (response.user.profileUpdatedAt != null) {
              this.router.navigate([routes.freelancer_dashboard]);
            } else {
              this.router.navigate(['/pages/onboard-screen']);
            }
          } else if (response.role === 'admin') {
            this.router.navigate([routes.admin_dashboard]);
          } else if (response.role === 'company-employee') {
            this.router.navigate([routes.employee_dashboard]);
          }
          //
          this.loginError = null; // Clear any previous errors
        },
        (error) => {
          this.loginError =
            error.error.message || 'Login failed. Please try again.';
        }
      );
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  iconLogle() {
    this.Toggledata = !this.Toggledata;
  }
  otherPages(val: string) {
    localStorage.setItem(val, val);
  }

  public togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }
}

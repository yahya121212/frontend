import { Component, OnInit } from '@angular/core';
import { CookieConsentService } from 'src/app/shared/cookie-consent.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Validators } from '@angular/forms';
import { routes } from 'src/app/core/helpers/routes/routes';
import { UserService } from '../service/user.service';
import { EmailStorageService } from '../service/email-storage.service';
import { environment } from 'src/environments/environment';
import { CompanyService } from 'src/app/core/services/company.service';
import { LocationService } from 'src/app/core/services/location.service';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public routes = routes;
  password: boolean[] = [false, false];
  companiesData: any;
  signupForm!: FormGroup;
  passwordValidations = {
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  };
  selectedNaf: any;
  selectedCompany: any;

  form!: FormGroup;
  location!: FormGroup;
  constructor(
    private translate: TranslateService,
    private cookieConsent: CookieConsentService,
    public Router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private emailStorageService: EmailStorageService,
    private alertService: AlertService,
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,



  ) {


    this.translate.setDefaultLang(environment.defaultLanguage);

    this.signupForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, this.passwordValidator()]],
        confirmPassword: ['', [Validators.required]],
        terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator() }
    );

    this.signupForm.get('password')?.valueChanges.subscribe((password) => {
      this.updatePasswordValidations(password);
    });
  }
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {




    setTimeout(() => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '129135782182-1jn2nr1hpt9fqd0no108noc28gd1d19r.apps.googleusercontent.com',
          callback: (response: any) => {
            const idToken = response.credential;
            this.http.post(`${environment.apiUrl}/auth/google`, { idToken }).subscribe({
              next: (res: any) => {
                // Store the email in the service
                this.emailStorageService.setEmail(res.email);
                this.alertService.showAlert(
                  'Candidature created successfully!',
                  'success'
                );

                // Redirect to the VerifyEmailComponent
                this.Router.navigate(['/auth/verify-email']);
                console.log('Response from Google login:', res?.user?.id);
                this.verifyOtp(res?.user?.id);
              },
              error: (error) => {
                if (error?.error?.statusCode === 409) {
                  this.loginError = 'Email déjà inscrit.';
                } else if (error?.error?.statusCode === 401) {
                  this.loginError = 'Identifiants invalides.';
                } else if (error?.status === 0) {
                  this.loginError = 'Erreur réseau. Veuillez vérifier votre connexion.';
                } else {
                  this.loginError = 'Une erreur est survenue. Veuillez réessayer.';
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
                document.body.scrollTo({ top: 0, behavior: 'smooth' });
                console.error('Error creating user:', error);
              }
            });
          }
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleBtn'),
          { theme: 'outline', size: 'large' }
        );
      }

    }, 0); // Wait for view to fully load

    this.ActivatedRoute.params.subscribe(params => {
      console.log('Route params:', params?.['type']);
      if (params?.['type'] === 'candidat') {
        this.Router.navigate([routes.register]);
      }
      else {
        this.Router.navigate([routes.registerCompany]);
      }
    });
  }

  // Method to check the current password's validation status
  updatePasswordValidations(password: string): void {
    this.passwordValidations.minLength = password.length >= 8;
    this.passwordValidations.hasLowercase = /[a-z]/.test(password);
    this.passwordValidations.hasUppercase = /[A-Z]/.test(password);
    this.passwordValidations.hasNumber = /[0-9]/.test(password);
    this.passwordValidations.hasSpecialChar = /[!@#$%^&*+]/.test(password);
  }
  loginError: string | null = null;

  passwordMatchValidators(): boolean {
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;

    return password && confirmPassword && password === confirmPassword
      ? true
      : false;
  }
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;

      return password && confirmPassword && password !== confirmPassword
        ? { passwordsMismatch: true }
        : null;
    };
  }

  public togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }
  onSubmit(): void {
    if (this.cookieConsent.hasRefused()) {
      window.alert(
        'La création de compte est bloquée car vous avez refusé les cookies.'
      );
      return;
    }
    if (this.signupForm.valid) {
      const formValues = this.signupForm.value;
      const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
      const username = `${formValues.firstName}${randomSixDigitNumber}`;

      const data = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        password: formValues.password,
      };

      this.userService.createUser(data).subscribe(
        (response) => {
          // Store the email in the service
          this.emailStorageService.setEmail(formValues.email);
          this.alertService.showAlert(
            'Candidature created successfully!',
            'success'
          );

          // Redirect to the VerifyEmailComponent
          this.Router.navigate(['/auth/verify-email']);
          this.verifyOtp(response?.id);
        },
        (error) => {

          if (error?.error?.statusCode === 409) {
            this.loginError = 'Email déjà inscrit.';
          } else if (error?.error?.statusCode === 401) {
            this.loginError = 'Identifiants invalides.';
          } else if (error?.status === 0) {
            this.loginError = 'Erreur réseau. Veuillez vérifier votre connexion.';
          } else {
            this.loginError = 'Une erreur est survenue. Veuillez réessayer.';
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
          document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
          document.body.scrollTo({ top: 0, behavior: 'smooth' });
          console.error('Error creating user:', error);
        }
      );
    }
  }


  verifyOtp(userId: string) {
    this.userService.verifyOtp(userId).subscribe(
      (response) => { },
      (error) => {
        console.error('Verification failed', error);
      }
    );
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.value;

      if (!password) return null;

      const minLength = password.length >= 8;
      const hasLowercase = /[a-z]/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*+]/.test(password);

      const errors: { [key: string]: boolean } = {};

      if (!minLength) errors['minLength'] = true;
      if (!hasLowercase) errors['hasLowercase'] = true;
      if (!hasUppercase) errors['hasUppercase'] = true;
      if (!hasNumber) errors['hasNumber'] = true;
      if (!hasSpecialChar) errors['hasSpecialChar'] = true;

      return Object.keys(errors).length ? errors : null;
    };
  }
}

import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/core/services/company.service';
import { routes } from 'src/app/core/helpers/routes/routes';
import { Profile } from 'src/app/core/models/models';
import * as lodash from 'lodash';
import {
  markFormGroupTouched,
  showSuccessModal,
} from 'src/app/core/services/common/common-functions';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-basic-settings',
  templateUrl: './basic-settings.component.html',
  styleUrls: ['./basic-settings.component.scss'],
})
export class BasicSettingsComponent {
  subscription: Subscription | null = null;
  @Output() profileUpdated = new EventEmitter<any>();
  public routes = routes;
  profile: Profile | null = null;
  companyId: string | null = null;
  basicForm: FormGroup;
  showCheckoutHour = true;
  initialFormValues: any;

  public isCheckboxChecked = true;
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private profileService: ProfileService
  ) {
    this.basicForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      facebook: [
        null,
        [
          Validators.pattern(
            /^(https?:\/\/)?((www|m|web)\.)?facebook\.com\/(profile\.php\?id=\d+|[A-Za-z0-9_.-]+)\/?$/i
          ),
        ],
      ],
      instagram: [
        null,
        [
          Validators.pattern(
            /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9._]+\/?$/i
          ),
        ],
      ],
      linkedIn: [
        null,
        [
          Validators.pattern(
            /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-]+\/?$/i
          ),
        ],
      ],
      userId: [''],
    });
  }
  get firstName() {
    return this.basicForm.get('firstName');
  }
  get lastName() {
    return this.basicForm.get('lastName');
  }
  get phone() {
    return this.basicForm.get('phone');
  }
  get facebook() {
    return this.basicForm.get('facebook');
  }
  get instagram() {
    return this.basicForm.get('instagram');
  }
  get linkedIn() {
    return this.basicForm.get('linkedIn');
  }

  ngOnInit(): void {
    this.subscription = this.profileService.currentUserProfile$.subscribe({
      next: (profile) => {
        if (profile) {
          this.profile = profile;
          this.companyId = profile.company?.id;
          this.initialFormValues = {
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            userId: profile.id,
            facebook: profile.company?.socialMedia?.facebook,
            instagram: profile.company?.socialMedia?.instagram,
            linkedIn: profile.company?.socialMedia?.linkedIn,
          };
          this.basicForm.patchValue(this.initialFormValues);
        }
      },
      error: (err) => console.error(err),
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe(); // Clean up the subscription
  }

  toggleCheckoutHour() {
    this.showCheckoutHour = !this.showCheckoutHour;
  }

  onSubmit() {
    markFormGroupTouched(this.basicForm);
    const trimmedValues = this.trimFormValues(this.basicForm.value);

    if (lodash.isEqual(trimmedValues, this.initialFormValues)) {
      return;
    }

    if (this.basicForm.valid && this.companyId) {
      this.companyService
        .updateCompany(this.companyId, trimmedValues)
        .subscribe({
          next: (res) => {
            this.saveProfileChanges(res);
            showSuccessModal('data-changed');
          },
          error: (err) => {
            console.error(err);
          },
        });
    }
  }

  trimFormValues(values: any): any {
    const trimmedValues: any = {};
    Object.keys(values).forEach((key) => {
      const value = values[key];
      trimmedValues[key] = typeof value === 'string' ? value.trim() : value; // Trim if it's a string
    });
    return trimmedValues;
  }

  onCancel() {
    // Reset the form to initial values
    if (this.initialFormValues) {
      this.basicForm.patchValue(this.initialFormValues);
    }
  }

  saveProfileChanges(updatedProfile: any) {
    this.profileUpdated.emit(updatedProfile); // Notify the parent
  }
}

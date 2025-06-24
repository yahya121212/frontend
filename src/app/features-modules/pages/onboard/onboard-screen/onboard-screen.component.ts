import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import * as pdfjsLib from 'pdfjs-dist';
import { OcrService } from 'src/app/core/services/ocr.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { LocationService } from 'src/app/core/services/location.service';
import { JobService } from 'src/app/core/services/job.service';
import { CandidateService } from 'src/app/core/services/condidate.service';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/core/services/language.service';
import { SkillService } from 'src/app/core/services/skill.service';
import { IaService } from 'src/app/core/services/ia.service';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface data {
  value: string;
}
interface Language {
  id: string;
  name: string;
}
interface Skill {
  id: string;
  name: string;
}
@Component({
  selector: 'app-onboard-screen',
  templateUrl: './onboard-screen.component.html',
  styleUrls: ['./onboard-screen.component.scss'],
})
export class OnboardScreenComponent implements OnInit {
  public selectedFieldSet = [1];
  public routes = routes;
  public displayBlock = false;
  public displayNone = false;

  public skills: number[] = [];
  public education: number[] = [];
  public certification: number[] = [];
  public activity: number[] = [];
  public experience: number[] = [];
  public language: number[] = [];
  public datas: boolean[] = [true];
  public isCheckboxChecked = true;
  public globalErrorMessage: boolean | null = false;
  extractedText = '';
  spinner: boolean = false;
  locationForm: FormGroup;
  filteredJobs: any[] = [];
  jobNotExist = true;

  cvs: File[] = [];
  form: FormGroup;
  skillLevels = ['Basique', 'Professionnel', 'Avancé'];

  selectedListMetiers = [{ value: 'Métier 1' }, { value: 'Métier 2' }];
  zipCodes: any[] = [];
  cities: any[] = [];
  jobs: any[] = [];
  subActivities: any[] = [];
  filteredLanguages: Language[] = [];
  dbLanguages: any[] = [];
  activeIndex: number = 0;
  filteredSkills: Skill[] = [];
  dbSkills: any[] = [];
  index: number = 0;

  constructor(
    private datePipe: DatePipe,
    private ocrService: OcrService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private locationService: LocationService,
    private jobService: JobService,
    private candidateService: CandidateService,
    private languageService: LanguageService,
    private iaService: IaService,
    private skillService: SkillService,
    private router: Router
  ) {
    this.translate.setDefaultLang(environment.defaultLanguage);
    this.locationForm = this.fb.group({
      adresse: [''],
      postalCode: ['', Validators.required],
      city: [{ value: '', disabled: true }],
      department: [{ value: '', disabled: true }],
      region: [{ value: '', disabled: true }],
    });

    this.form = this.fb.group({
      personalDetails: this.fb.group({
        lastName: [''],
        firstName: [''],
        birthday: [''],
        phoneNumber: ['', Validators.required],
        emailAddress: [localStorage.getItem('email')],
      }),
      jobTitle: [''],
      location: this.locationForm, // Add location form group here
      activities: this.fb.array([this.createActivity()]), // Initialize with one activity form group

      skills: this.fb.array([this.createSkill()]), // Ensure skills are initialized

      experiences: this.fb.array([this.createExperience()]),
      education: this.fb.array([this.createEducation()]), // initialize the education form array
      languages: this.fb.array([this.createLanguage()]), // Initialize with one language entry
    });
  }
  ngOnInit(): void {
    this.getCodeZipes();
    this.getJobs();
    this.getSubActivities();
    this.getSSkillsFromDb();
    this.getLanguagesFromDb();
    this.locationForm.get('postalCode')?.valueChanges.subscribe((value) => {
      if (value) {
        this.locationForm.get('city')?.enable();
        this.locationForm.get('department')?.enable();
        this.locationForm.get('region')?.enable();
      } else {
        this.locationForm.get('city')?.disable();
        this.locationForm.get('department')?.disable();
        this.locationForm.get('region')?.disable();
      }
    });

    this.locationForm.get('postalCode')?.valueChanges.subscribe((zipCode) => {
      if (zipCode) {
        this.onZipCodeChange({
          target: { value: zipCode },
        } as unknown as Event);
      }
    });
  }

  createSkill(): FormGroup {
    return this.fb.group({
      skillName: [''], // Default empty value
      level: [''], // Default empty value
    });
  }

  getSSkillsFromDb() {
    this.skillService.getSkills().subscribe({
      next: (res) => {
        this.dbSkills = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  filterSkills(e: any, i: number) {
    this.index = i;
    let query = e.value;
    if (!query) {
      this.filteredSkills = this.dbSkills;
    } else {
      this.filteredSkills = this.dbSkills.filter((skill) =>
        skill.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  selectSkill(skill: any, index: number) {
    const skillsArray = this.form.get('skills') as FormArray;
    const skillForm = skillsArray.at(index) as FormGroup;

    if (skillForm) {
      skillForm.patchValue({ name: skill.name });
    }

    this.filteredSkills = [];
  }

  getLanguagesFromDb() {
    this.languageService.getLanguages().subscribe({
      next: (res) => {
        this.dbLanguages = res;
      },
      error: (err) => {},
    });
  }

  onNextClick(): void {
    const postalCodeControl = this.locationForm.get('postalCode');
    const cityControl = this.locationForm.get('city');
    const phoneControl = this.form.get('personalDetails.phoneNumber');
    postalCodeControl?.markAsTouched();
    cityControl?.markAsTouched();
    phoneControl?.markAsTouched();

    if (this.locationForm.invalid || phoneControl?.invalid) {
      return; // Stop further execution
    }

    this.selectedFieldSet[0] = 2;
  }

  filterLanguages(e: any, i: number) {
    this.activeIndex = i;
    let query = e.value;
    if (!query) {
      this.filteredLanguages = this.dbLanguages;
    } else {
      this.filteredLanguages = this.dbLanguages.filter((lang) =>
        lang.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
  selectLanguage(lang: any, index: number) {
    const languagesArray = this.form.get('languages') as FormArray;
    const languageForm = languagesArray.at(index) as FormGroup;

    if (languageForm) {
      languageForm.patchValue({ name: lang.name });
    }

    this.filteredLanguages = [];
  }

  createEducation(): FormGroup {
    return this.fb.group({
      degreeName: [''], // Default value for degree name
      universityName: [''], // Default value for university name
      startDate: [''], // Default value for start date
      endDate: [''], // Default value for end date
    });
  }

  // Create a new experience form group
  createExperience(): FormGroup {
    return this.fb.group({
      companyName: ['', Validators.required],
      postTitle: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  // Create a new language form group
  createLanguage(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      level: ['', Validators.required],
    });
  }

  getSubActivities() {
    this.jobService.getSubActivities().subscribe({
      next: (data) => {
        this.subActivities = data;
      },
      error: (error) => {
        console.error(error);
        this.globalErrorMessage = true;
      },
    });
  }

  previous: string | null = null;

  onSubActivityChange(event: any, index: number): void {
    const subActivityName = event.target.value?.trim(); // Trim whitespace for consistency

    // Check if the new sub-activity is different from the previous one
    if (subActivityName && subActivityName !== this.previous) {
      this.previous = subActivityName; // Update the previous value

      // Fetch details for the new sub-activity
      this.jobService.getSubActivitiesDetails(subActivityName).subscribe(
        (data) => {
          // Access the specific activity form group by index
          const activitiesArray = this.form.get('activities') as FormArray;
          const activityGroup = activitiesArray.at(index) as FormGroup;

          // Patch the activite field in the selected activity group
          activityGroup.patchValue({
            activite: data?.activity?.name || '',
          });
        },
        (error) => {
          console.error('Error fetching sub-activity details:', error);
        }
      );
    }
  }

  addSkillManually() {
    const skillsArray = this.form.get('skills') as FormArray;
    skillsArray.push(this.createSkill()); // Adds a new skill with skillName and level
  }

  get languagesArray(): FormArray {
    return this.form.get('languages') as FormArray;
  }

  // Getter for accessing the skills form array
  get skillsArray(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  // Example of accessing controls in the template
  removeSkills(index: number) {
    this.skillsArray.removeAt(index); // Use removeAt method to remove from FormArray
  }

  patchFormData(response: any) {
    const personal =
      response['Informations Personnelles'] ||
      response['informations_personnelles'] ||
      response['coordonnees_personnelles'];

    // Patch personal details
    this.form.get('jobTitle')?.patchValue(response['titre_poste'] || '');
    this.form.get('personalDetails')?.patchValue({
      lastName: personal['Nom'] || personal['nom'] || '',
      firstName: personal['Prenom'] || personal['prenom'] || '',
      birthday:
        personal['Date de naissance'] || personal['Date de naissance'] || '',
      phoneNumber: personal['Téléphone'] || personal['telephone'] || '',
      emailAddress: localStorage.getItem('email'),
    });

    this.locationForm.get('postalCode')?.patchValue(personal['code_postal']);
    this.locationForm.get('adresse')?.patchValue(personal['adresse']);

    // Patch skills
    const skills: string[] = response['competences']; // Extract skills array
    this.skillsArray.clear(); // Clear existing skills

    // Iterate through the skills and create a form group for each skill
    skills?.forEach((skillName: string) => {
      this.skillsArray.push(
        this.fb.group({
          skillName: [skillName || ''], // Add skill name to form control
          level: ['Professionnel'], // Initialize level as empty or provide a default value
        })
      );
    });

    const educationData = response['diplomes_certifications'] || [];
    this.educationArray.clear();

    educationData.forEach((education: any) => {
      this.educationArray.push(
        this.fb.group({
          degreeName: [
            education['Diplôme'] ||
              education['Certification'] ||
              education['Formation'] ||
              education['nom'] ||
              '',
          ],
          universityName: [
            education['etablissement'] || education['Délivrée par'] || '',
          ],
          startDate: [
            this.formatDateString(
              education['Date début'] || education['date_debut']
            ),
          ],
          endDate: [
            this.formatDateString(
              education['Date fin'] || education['date_fin']
            ),
          ],
        })
      );
    });

    // Patch experiences
    const experiences =
      response['experiences_professionnelles'] ||
      response['Expériences professionnelles'];
    this.experiencesArray.clear();

    experiences.forEach((exp: any) => {
      let endDate = exp['date_fin'] || exp['Date fin'] || '';

      // Check if endDate is defined and if the day is 31
      if (endDate) {
        const endDateObj = new Date(endDate);
        if (endDateObj.getDate() === 31) {
          // Set the day to 1
          endDateObj.setDate(1);
          endDate = endDateObj.toISOString().split('T')[0]; // Format back to YYYY-MM-DD
        }
      }

      this.experiencesArray.push(
        this.fb.group({
          companyName: [exp['Entreprise'] || exp['entreprise'] || ''],
          postTitle: [exp['titre_poste'] || ''],
          location: [exp['Lieu'] || ''],
          description: [exp['description'] || ''],
          startDate: [
            this.formatDateString(exp['Date début'] || exp['date_debut']),
          ],
          endDate: [this.formatDateString(exp['Date fin'] || exp['date_fin'])],
        })
      );
    });

    // Patch languages
    const languages = response['langues'] || response['languages'] || [];
    if (languages.length !== 0) {
      this.languagesArray.clear();
      languages.forEach((lang: any) => {
        this.languagesArray.push(
          this.fb.group({
            name: [lang || '', Validators.required],
            level: ['Professionnel', Validators.required],
          })
        );
      });
    }
  }

  formatDateString(dateStr: string | undefined): string | null {
    if (!dateStr) return null;

    const dateParts = dateStr.split('/');
    if (dateParts.length !== 3) return null; // Ensure date is in DD/MM/YYYY format

    const day = +dateParts[0];
    const month = +dateParts[1] - 1; // Months are 0-based in JavaScript Date
    const year = +dateParts[2];

    const formattedDate = new Date(year, month, day);
    if (isNaN(formattedDate.getTime())) return null; // Check if date is valid

    return this.datePipe.transform(formattedDate, 'dd/MM/yyyy'); // Format to "DD/MM/YYYY"
  }

  // Add a new experience to the array
  addExperience(): void {
    this.experiencesArray.push(this.createExperience());
  }

  // Remove an experience from the array
  removeExperience(index: number): void {
    if (this.experiencesArray.length > 1) {
      this.experiencesArray.removeAt(index);
    }
  }
  get experiencesArray(): FormArray {
    return this.form.get('experiences') as FormArray;
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.spinner = true;
      this.cvs = Array.from(input.files);

      // Call the API and patch form with the response
      if (this.cvs.length > 0) {
        try {
          this.spinner = true;
          const response = await this.ocrService.runPipeline(this.cvs);
          this.patchFormData(response);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          this.spinner = false;
        }
      } else {
        console.warn('Please enter a username.');
      }
    }
  }

  get educationArray(): FormArray {
    return this.form.get('education') as FormArray;
  }

  addEducation() {
    const educationArray = this.form.get('education') as FormArray;
    educationArray.push(this.createEducation());
  }

  removeEducation(i: number) {
    const educationArray = this.form.get('education') as FormArray;
    educationArray.removeAt(i);
  }

  block() {
    this.displayBlock = !this.displayBlock;
  }
  none() {
    this.displayNone = !this.displayNone;
  }

  addSkills() {
    this.skills.push(1);
  }

  addCertification() {
    this.certification.push(1);
  }
  removeCertification(index: number) {
    this.certification.splice(index, 1);
  }

  createActivity(): FormGroup {
    return this.fb.group({
      job: ['', Validators.required],
      sousActivite: ['', Validators.required],
      activite: [''],
    });
  }

  addActivity() {
    this.activities.insert(0, this.createActivity()); // Insert at the first position (index 0)
  }

  removeActivity(index: number) {
    this.activities.removeAt(index);
  }

  // Add a new language to the array
  addLanguage(): void {
    this.languagesArray.push(this.createLanguage());
  }

  // Remove a language from the array
  removeLanguage(index: number): void {
    if (this.languagesArray.length > 1) {
      this.languagesArray.removeAt(index);
    }
  }

  removeDatas(index: number) {
    this.datas[index] = !this.datas[index];
  }

  selectedList6: data[] = [
    { value: 'Basique' },
    { value: 'Professionnel' },
    { value: 'Avancé' },
  ];

  getCodeZipes() {
    this.locationService.getZipCodes().subscribe(
      (data) => {
        this.zipCodes = data;
      },
      (error) => {
        console.error('Error fetching ZIP codes:', error);
      }
    );
  }
  onZipCodeChange(event: Event): void {
    const selectedZipId = (event.target as HTMLSelectElement).value;
    if (selectedZipId) {
      this.locationService.getZipCodeInfo(selectedZipId).subscribe(
        (data) => {
          this.cities = data?.cities;
          // Reset department and region fields
          this.locationForm.patchValue({
            city: data?.cities[0]?.name,
            department: data?.cities[0]?.department?.name,
            region: data?.cities[0]?.department?.region?.name,
          });
        },
        (error) => {
          console.error('Error fetching ZIP code info:', error);
        }
      );
    }
  }

  onCityChange(event: Event): void {
    const selectedCityId = (event.target as HTMLSelectElement).value;
    this.locationService.getcityInfo(selectedCityId).subscribe(
      (city) => {
        // this.cities = data.cities; // Update the cities list
        if (city) {
          this.locationForm.patchValue({
            department: city?.department?.name,
            region: city?.department?.region?.name,
          });
        }
      },
      (error) => {
        console.error('Error fetching ZIP code info:', error);
      }
    );
  }

  get activities(): FormArray {
    return this.form.get('activities') as FormArray;
  }

  getJobs() {
    // Fetch the list of jobs (Métier) on component initialization
    this.jobService.getJobs().subscribe((data) => {
      this.jobs = data;
    });
  }
  onJobChange(event: any, index: number) {
    const jobId = event.target.value;
    if (jobId) {
      // Fetch sous-activités and activités based on the selected job
      this.jobService.getJobDetails(jobId).subscribe((data) => {
        const activityGroup = this.activities.at(index);
        activityGroup.patchValue({
          sousActivite: data?.subActivity?.name,
          activite: data?.subActivity?.activity?.name,
        });
      });
    }
  }

  create(event: any) {
    // Check if the form is valid
    if (this.form.invalid) {
      // Mark all controls as touched to show validation errors
      this.form.markAllAsTouched();
      return; // Stop further processing
    }
    const candidateData = new FormData();
    candidateData.append('userInformation', JSON.stringify(this.form.value));

    // Ensure there's at least one CV before appending
    if (this.cvs && this.cvs.length > 0) {
      candidateData.append('cv', this.cvs[0]);
    } else {
      console.error('No CV uploaded.');
      // Optionally, show an error message to the user
      return; // Stop further processing
    }

    this.candidateService.createCandidate(candidateData).subscribe({
      next: (res) => {
        this.iaService.generateCandidateEmb(res?.data?.id);
        this.router.navigate(['/freelancer/dashboard']);
      },
      error: (error) => {
        console.error('Error creating candidate:', error);
        // Optionally, handle error feedback to the user
      },
    });
  }

  filterJobs(e: any): void {
    const query = e.value?.trim(); // Trim whitespace from the query
    if (!query) {
      this.filteredJobs = [...this.jobs];
      this.jobNotExist = false;
    } else {
      this.filteredJobs = this.jobs.filter((job) =>
        job.name.toLowerCase().includes(query.toLowerCase())
      );
      this.jobNotExist = this.filteredJobs.length === 0;
    }
  }

  selectJob(job: any): void {
    // Clear the filteredJobs array and reset jobNotExist flag
    this.filteredJobs = [];
    this.jobNotExist = false;

    // Update the first activity in the activities form array with the selected job's details
    const activitiesArray = this.form.get('activities') as FormArray;

    if (activitiesArray.length > 0) {
      const firstActivityGroup = activitiesArray.at(0) as FormGroup;
      firstActivityGroup.patchValue({
        job: job?.name || '',
        sousActivite: job?.subActivity?.name || '',
        activite: job?.subActivity?.activity?.name || '',
      });
    }
  }

  addJob(): void {
    const jobName = this.form.get('job')?.value?.trim(); // Get and trim the job name
    if (!jobName) {
      return; // Do nothing if the job name is empty
    }

    // Check if the job already exists in the filtered list
    const existingJob = this.filteredJobs.find(
      (job) => job.name.toLowerCase() === jobName.toLowerCase()
    );

    if (existingJob) {
      // Job already exists, no need to add
      return;
    }

    // Add the new job to the filtered list
    this.filteredJobs.push({ name: jobName });

    // Update the activities form array
    const activitiesArray = this.form.get('activities') as FormArray;
    if (activitiesArray.length === 0) {
      // If no activities exist, add one
      activitiesArray.push(this.createActivity());
    }

    // Update the first activity with the new job
    const firstActivityGroup = activitiesArray.at(0) as FormGroup;
    firstActivityGroup.patchValue({
      job: jobName,
      sousActivite: '',
      activite: '',
    });

    // Reset temporary fields
    this.filteredJobs = [];
    this.jobNotExist = true;
  }
}

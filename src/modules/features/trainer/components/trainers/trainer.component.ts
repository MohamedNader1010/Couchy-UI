import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { AlertService } from 'src/core/services/alert.service';
import { GenericService } from 'src/core/services/generic.service';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { CategoryIsActiveDto } from 'src/modules/features/categories/interfaces/update-isActive-category.dto';
import { PermissionClaims } from 'src/modules/shared/enums/permissionClaims.enum';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { TrainerDto } from '../../interfaces/trainer.interface';
import { Genders } from 'src/modules/shared/enums/genders.enum';
import { CategoryDto } from 'src/modules/features/categories/interfaces/category.dto';
import { LanguageEnum } from 'src/modules/shared/enums/languages.enums';
import { catchError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FileUpload } from 'primeng/fileupload';
import { ValidateEmailService } from 'src/modules/shared/services/validate-email.service';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss'],
})
export class TrainerComponent implements OnInit {
  @ViewChild("fileUpload") fileUpload!: FileUpload;
  isLoading = false;
  claim: any;
  breadcrumbItems: MenuItem[] = [];
  trainers: TrainerDto[] = [];
  columns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  textColumns: any[] = [];
  trainerDialog: boolean = false;
  submitted: boolean = false;
  selectedFile: File | null = null;
  trainer: TrainerDto = {} as TrainerDto;
  genderOptions = [
    { label: this._translate.instant('labels.male'), value: Genders.Male },
    { label: this._translate.instant('labels.female'), value: Genders.Female },
  ];
  languageOptions = [
    { label: this._translate.instant('labels.english'), value: LanguageEnum.English },
    { label: this._translate.instant('labels.arabic'), value: LanguageEnum.Arabic },
  ];
  categoriesOptions: { value: number; label: string }[] = [] as { value: number; label: string }[];
  constructor(
    private _trainerService: GenericService<TrainerDto[]>,
    private _alertService: AlertService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _permissionService: PermissionClaimsService,
    private _categoriesService: GenericService<CategoryDto[]>,
    private _translate: TranslateService,
    public validateEmail: ValidateEmailService
  ) {
    this.claim = this._permissionService.getPermission(PermissionClaims.TrainerPermission);
   
  }
  ngOnInit(): void {
    this.intiComponent(); 
    this._translate.onLangChange.subscribe(_ => {
      this.intiComponent();
    })
    this.isLoading = true;
    this._categoriesService.setControllerName('Category');
    this._categoriesService.getAll().subscribe((result) => {
      if (result.code == ResponseCode.Success) {
        result.body.map((category) => {
          this.categoriesOptions.push({ value: category.id, label: category.nameEn });
        });
      }
    });
    this._trainerService.setControllerName('User/Trainer');
    this._trainerService
      .getAll()
      .pipe(
        catchError((errorMessage) => {
          this._alertService.fail(errorMessage.message);
          return [];
        }),
      )
      .subscribe((result) => {
        if (result && result.code == ResponseCode.Success) {
          this.trainers = result.body;
        } else {
          if (result) this._alertService.fail(result.message);
        }
        this.isLoading = false;
      });
  }
  naviagateToPackages(id: string) {
    this.navigateToPage('packages', id);
  }
  navigateToGroups(id: string) {
    this.navigateToPage('groups', id);
  }

  private navigateToPage(pageName: string, id: string) {
    this._router.navigate([pageName], {
      relativeTo: this._activatedRoute,
      queryParams: { id: id },
    });
  }
  openNew() {
    this.submitted = false;
    this.trainerDialog = true;
  }

  onToggleSwitch(id: string, newValue: boolean) {
    this.isLoading = true;
    this._trainerService.setControllerName('User/UpdateIsActive');
    const updateIsActive: CategoryIsActiveDto = {
      isActive: newValue,
      id: id,
    };
    this._trainerService.update(updateIsActive as any).subscribe((result: any) => {
      if (result.code == ResponseCode.Success) {
        const updatedIndex = this.trainers.findIndex((c) => c.id === id);
        if (updatedIndex !== -1) {
          if (result.body.isActive) {
            this._alertService.success(this._translate.instant('alert.Activated'));
          } else {
            this._alertService.warn(this._translate.instant('alert.DeActivated'));
          }

          this.trainers[updatedIndex] = result.body as any;
          this.trainerDialog = false;
        }
      } else {
        this._alertService.fail(result.message);
      }
      this.isLoading = false;
    });
  }
  hideDialog() {
    this.trainerDialog = false;
    this.submitted = false;
    this.trainer = {} as TrainerDto;
  }
  saveTrainer() {
    this.isLoading = true;
    this._trainerService.setControllerName('User/AddTrainer');

    this._trainerService
      .addWithFormData(this.trainer as any, this.selectedFile, 'image')
      .pipe(
        catchError((errorResponse) => {
          this.isLoading = false;
          this._alertService.fail(errorResponse.message);
          return [];
        }),
      )
      .subscribe({
        next: (result: any) => {
          if (result.body) this.trainers.push(result.body.body);
        },
        complete: () => {
          this.isLoading = false;
          this.trainerDialog = false;
        },
      });
  }

  onFileSelect(file: File) {
    this.selectedFile = file;
  }
  cancelImageSelection() {
    this.fileUpload.clear();
    this.selectedFile = null;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  isValid() {
    if (!this.trainer.email || !this.trainer.name || !this.trainer.gender 
      || !this.trainer.phoneNumber || !this.isValidPhoneNumber() 
      || !this.validateEmail.isValidEmail(this.trainer.email) || !this.trainer.categoryId) {
      return false;
    } else {
      return true;
    }
  }
  isValidPhoneNumber(): boolean {
    const phoneNumber = this.trainer.phoneNumber;
    const pattern = /^[956]\d{7}$/; 
    return pattern.test(phoneNumber ?? '');
  }
  private intiComponent() {
    this.columns = [];
    this.breadcrumbItems = [];
    this.genderOptions = []; 
    this.languageOptions = [];

    this.genderOptions = [
      { label: this._translate.instant('labels.male'), value: Genders.Male },
      { label: this._translate.instant('labels.female'), value: Genders.Female },
    ];
    this.languageOptions = [
      { label: this._translate.instant('labels.english'), value: LanguageEnum.English },
      { label: this._translate.instant('labels.arabic'), value: LanguageEnum.Arabic },
    ];
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.dashboard'), routerLink: '/' });
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.trainers') });
    this.columns = [
      { field: 'id', header: this._translate.instant('table.columns.id'), sortable: true },
      { field: 'name', header: this._translate.instant('table.columns.name'), sortable: true },
      { field: 'phoneNumber', header: this._translate.instant('table.columns.phoneNumber'), sortable: true },
      { field: 'isActive', header: this._translate.instant('table.columns.isActive'), sortable: true },
      { field: 'packages&groups', header: this._translate.instant('table.columns.packages&groups'), sortable: false },
    ];
    this.textColumns = this.columns.filter((col) => !(col.field === 'packages&groups' || col.field === 'isActive'));
  }
}

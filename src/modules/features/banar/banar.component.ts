import { Component, OnInit, ViewChild } from '@angular/core';
import { BanarDto } from './interfaces/banar.dto';
import { MenuItem, MessageService } from 'primeng/api';
import { GenericService } from '../../../core/services/generic.service';
import { Table } from 'primeng/table';
import { BanarIsActiveDto } from './interfaces/update-isActive-banar.dto';
import { Observer, catchError, retry } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AlertService } from 'src/core/services/alert.service';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { PermissionClaims } from 'src/modules/shared/enums/permissionClaims.enum';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { TranslateService } from '@ngx-translate/core';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-banar',
  templateUrl: './banar.component.html',
  styleUrls: ['./banar.component.scss'],
})
export class BanarComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  isLoading = false;
  _idToBeDeleted: number = 0;
  breadcrumbItems: MenuItem[] = [];
  banarDialog: boolean = false;
  deleteBanarDialog: boolean = false;
  banars: BanarDto[] = [];
  banar: BanarDto = {} as BanarDto;
  submitted: boolean = false;
  columns: any[] = [];
  textColumns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  selectedFile!: File | null;
  claim: any;
  constructor(private _alertService: AlertService, private banarsService: GenericService<BanarDto[]>, private _permissionService: PermissionClaimsService, private _translate: TranslateService) {
    this.claim = this._permissionService.getPermission(PermissionClaims.BanarPermission);
  }

  ngOnInit() {
    this._translate.onLangChange.subscribe((_) => {
      this.initComponents();
    });
    this.initComponents();
  }
  onFileSelect(file: File) {
    this.selectedFile = file;
  }
  onToggleSwitch(id: number, newValue: boolean) {
    this.isLoading = true;
    this.banarsService.setControllerName('Banar/updateIsActive');
    const updateIsActive: BanarIsActiveDto = {
      isActive: newValue,
      id: id,
    };
    this.banarsService.update(updateIsActive as any).subscribe((result: any) => {
      if (result.code == ResponseCode.Success) {
        const updatedIndex = this.banars.findIndex((c) => c.id === id);
        if (updatedIndex !== -1) {
          this._alertService.success(result.message);
          this.banars[updatedIndex] = result.body;
          this.banarDialog = false;
        }
      } else {
        this._alertService.fail(result.message);
      }
      this.isLoading = false;
    });
  }
  cancelImageSelection() {
    this.selectedFile = null;
    this.fileUpload.clear();
  }
  openNew() {
    this.submitted = false;
    this.banarDialog = true;
  }

  editBanar(banar: BanarDto) {
    this.banar = { ...(banar as BanarDto) };
    this.banarDialog = true;
  }

  deleteBanar(banar: BanarDto) {
    this._idToBeDeleted = banar.id;
    this.banar = { ...banar };
    this.deleteBanarDialog = true;
  }

  confirmDelete() {
    this.isLoading = true;
    this.banarsService.setControllerName('Banar');
    if (this._idToBeDeleted)
      this.banarsService.delete(this._idToBeDeleted)
      .pipe(catchError((error) => {
        this._alertService.fail(error.message);
        return [];
      }))
      .subscribe(() => {
        const deletedIndex = this.banars.findIndex((c) => c.id == this._idToBeDeleted);
        if (deletedIndex !== -1) {
          this.banars.splice(deletedIndex, 1);
          this._idToBeDeleted = 0;
          this._alertService.success(this._translate.instant('messages.delete'));
        }
        this.isLoading = false;
        this.banar = {} as BanarDto;
      });
    this.deleteBanarDialog = false;
  }

  hideDialog() {
    this.banarDialog = false;
    this.submitted = false;
    this.banar = {} as BanarDto;
  }

  saveBanar() {
    this.isLoading = true;
    if (this.banar.nameAr?.trim() && this.banar.nameEn?.trim()) {
      this.banarsService.setControllerName('Banar');
      if (this.banar.id) {
        this.banarsService.updateWithFormData(this.banar as any, this.selectedFile, 'image').subscribe(this.updateFormDataObserver());
      } else {
        this.banarsService.addWithFormData(this.banar as any, this.selectedFile, 'image').subscribe(this.addFormDataObserver());
      }
    }
  }

  addFormDataObserver(): Partial<Observer<HttpEvent<Object>>> | (((value: HttpEvent<Object>) => void) | undefined) {
    return {
      next: (data: any) => {
        if (data.type === HttpEventType.UploadProgress) {
          // this.progdatas = Math.round((data.loaded / (data.total ?? 1)) * 100);
        } else if (data.type === HttpEventType.Response) {
          this._alertService.success('Banar Saved.');
          this.banars.push(data.body.body as BanarDto);
        }
      },
      complete: () => {
        this.submitted = true;
        this.banar = {} as BanarDto;
        this.banarDialog = false;
        this.isLoading = false;
      },
    };
  }

  updateFormDataObserver(): Partial<Observer<HttpEvent<Object>>> | (((value: HttpEvent<Object>) => void) | undefined) {
    return {
      next: (data: any) => {
        if (data.type === HttpEventType.UploadProgress) {
          // this.progdatas = Math.round((data.loaded / (data.total ?? 1)) * 100);
        } else if (data.type === HttpEventType.Response) {
          const updatedIndex = this.banars.findIndex((c) => c.id === this.banar.id);
          if (updatedIndex !== -1) {
            this._alertService.success('Banar Updated.');
            this.banars[updatedIndex] = data.body.body as BanarDto;
          }
        }
      },
      complete: () => {
        this.submitted = true;
        this.banar = {} as BanarDto;
        this.banarDialog = false;
        this.isLoading = false;
      },
    };
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  isValid() {
    if (!this.banar.nameAr || !this.banar.nameEn) {
      return false;
    } else {
      return true;
    }
  }
  private initComponents() {
    if (this.claim.CanGet) {
      this.columns = [];
      this.isLoading = true;
      this.banarsService.setControllerName('Banar');
      this.banarsService.getAll().subscribe((result) => {
        if (result.code == ResponseCode.Success) {
          this.banars = result.body;
        } else {
          this._alertService.fail(result.message);
        }
        this.isLoading = false;
      });
      this.columns = [
        { field: 'id', header: this._translate.instant('table.columns.id'), sortable: true },
        { field: 'nameEn', header: this._translate.instant('table.columns.englishName'), sortable: true },
        { field: 'nameAr', header: this._translate.instant('table.columns.arabicName'), sortable: true },
        { field: 'filePath', header: this._translate.instant('table.columns.image'), sortable: false },
        { field: 'isActive', header: this._translate.instant('table.columns.isActive'), sortable: true },
        { field: 'actions', header: '' },
      ];
      this.textColumns = this.columns.filter((col) => !(col.field === 'isActive' || col.field === 'actions' || col.field === 'filePath'));
    }
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: this._translate.instant('breadcrumb.dashboard'), routerLink: '/' });
    this.breadcrumbItems.push({ label: this._translate.instant('banar.title') });
  }
}

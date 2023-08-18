import { Component, OnInit } from '@angular/core';
import { BanarDto } from './interfaces/banar.dto';
import { MenuItem, MessageService } from 'primeng/api';
import { GenericService } from '../../../core/services/generic.service';
import { Table } from 'primeng/table';
import { BanarIsActiveDto } from './interfaces/update-isActive-banar.dto';
import { Observer } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-banar',
  templateUrl: './banar.component.html',
  styleUrls: ['./banar.component.scss'],
})
export class BanarComponent implements OnInit {
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
  constructor(private messageService: MessageService, private banarsService: GenericService<BanarDto>) {}

  ngOnInit() {
    this.banarsService.setControllerName('Banar');
    this.banarsService.getAll().subscribe((data) => (this.banars = data));
    this.columns = [
      { field: 'id', header: 'Id', sortable: true },
      { field: 'nameEn', header: 'English Name', sortable: true },
      { field: 'nameAr', header: 'Arabic Name', sortable: true },
      { field: 'link', header: 'link', sortable: true },
      { field: 'filePath', header: 'image', sortable: false },
      { field: 'isActive', header: 'Is Active', sortable: true },
      { field: 'actions', header: '' },
    ];
    this.textColumns = this.columns.filter((col) => !(col.field === 'isActive' || col.field === 'actions' || col.field === 'filePath'));
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Dashboard', url: '/' });
    this.breadcrumbItems.push({ label: 'Banars' });
  }
  onFileSelect(file: File) {
    console.log(file.name);
    this.selectedFile = file;
  }
  onToggleSwitch(id: number, newValue: boolean) {
    this.banarsService.setControllerName('Banar/updateIsActive');
    const updateIsActive: BanarIsActiveDto = {
      isActive: newValue,
      id: id,
    };
    this.banarsService.update(updateIsActive as BanarDto).subscribe((data) => {
      const updatedIndex = this.banars.findIndex((c) => c.id === this.banar.id);
      if (updatedIndex !== -1) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Button Updated',
          life: 3000,
        });
        this.banars[updatedIndex] = data;
        this.banarDialog = false;
      }
    });
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
    this.banarsService.setControllerName('Banar');
    if (this._idToBeDeleted)
      this.banarsService.delete(this._idToBeDeleted).subscribe(() => {
        const deletedIndex = this.banars.findIndex((c) => c.id == this._idToBeDeleted);
        if (deletedIndex !== -1) {
          this.banars.splice(deletedIndex, 1);
          this._idToBeDeleted = 0;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Banar Deleted',
            life: 3000,
          });
        }
      });
    this.deleteBanarDialog = false;
  }

  hideDialog() {
    this.banarDialog = false;
    this.submitted = false;
    this.banar = {} as BanarDto;
  }

  saveBanar() {
    if (this.banar.nameAr?.trim() && this.banar.nameEn?.trim()) {
      this.banarsService.setControllerName('Banar');
      if (this.banar.id) {
        this.banarsService.updateWithFormData(this.banar, this.selectedFile, 'image').subscribe(this.updateFormDataObserver());
      } else {
        debugger;
        this.banarsService.addWithFormData(this.banar, this.selectedFile, 'image').subscribe(this.addFormDataObserver());
      }
    }
  }

  addFormDataObserver(): Partial<Observer<HttpEvent<Object>>> | (((value: HttpEvent<Object>) => void) | undefined) {
    return {
      next: (data) => {
        if (data.type === HttpEventType.UploadProgress) {
          // this.progdatas = Math.round((data.loaded / (data.total ?? 1)) * 100);
        } else if (data.type === HttpEventType.Response) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Banar Saved',
            life: 3000,
          });
          this.banars.push(data.body as BanarDto);
        }
      },
      complete: () => {
        this.submitted = true;
        this.banar = {} as BanarDto;
        this.banarDialog = false;
      },
    };
  }

  updateFormDataObserver(): Partial<Observer<HttpEvent<Object>>> | (((value: HttpEvent<Object>) => void) | undefined) {
    return {
      next: (data) => {
        if (data.type === HttpEventType.UploadProgress) {
          // this.progdatas = Math.round((data.loaded / (data.total ?? 1)) * 100);
        } else if (data.type === HttpEventType.Response) {
          const updatedIndex = this.banars.findIndex((c) => c.id === this.banar.id);
          if (updatedIndex !== -1) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Banar Updated',
              life: 3000,
            });
            this.banars[updatedIndex] = data.body as BanarDto;
          }
        }
      },
      complete: () => {
        this.submitted = true;
        this.banar = {} as BanarDto;
        this.banarDialog = false;
      },
    };
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

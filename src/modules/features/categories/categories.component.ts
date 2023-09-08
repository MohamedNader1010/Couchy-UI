import { Component, OnInit } from '@angular/core';
import { MessageService, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { GenericService } from 'src/core/services/generic.service';
import { CategoryDto } from './interfaces/category.dto';
import { CategoryIsActiveDto } from './interfaces/update-isActive-category.dto';
import { UpdateCategoryNamesDto } from './interfaces/update-category-names.dto';
import { AlertService } from 'src/core/services/alert.service';
import { ResponseInfoDto } from 'src/modules/shared/interfaces/response.interface';
import { ResponseCode } from 'src/modules/shared/enums/response.enum';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { PermissionClaims } from 'src/modules/shared/enums/permissionClaims.enum';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  isLoading = false;
  claim: any;
  _idToBeDeleted: number = 0;
  breadcrumbItems: MenuItem[] = [];
  categoryDialog: boolean = false;
  deleteCategoryDialog: boolean = false;
  categories: CategoryDto[] = [];
  category: CategoryDto = {} as CategoryDto;
  submitted: boolean = false;
  columns: any[] = [];
  textColumns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  constructor(private _alertService: AlertService, private categoriesService: GenericService<CategoryDto[]>, private _permissionClaimService: PermissionClaimsService) {
    this.claim = this._permissionClaimService.getPermission(PermissionClaims.CategoriesPermission);
  }

  ngOnInit() {
    this.isLoading = true;
    this.categoriesService.setControllerName('Category');
    this.categoriesService.getAll().subscribe((result) => {
      if (result.code == +ResponseCode.Success) {
        this.categories = result.body;
      } else {
        this._alertService.fail(result.message);
      }
      this.isLoading = false;
    });
    this.columns = [
      { field: 'id', header: 'Id', sortable: true },
      { field: 'nameEn', header: 'English Name', sortable: true },
      { field: 'nameAr', header: 'Arabic Name', sortable: true },
      { field: 'isActive', header: 'Is Active', sortable: true },
      { field: 'actions', header: '' },
    ];
    this.textColumns = this.columns.filter((col) => !(col.field === 'isActive' || col.field === 'actions'));

    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Dashboard', routerLink: '/' });
    this.breadcrumbItems.push({ label: 'Categories' });
  }
  onToggleSwitch(id: number, newValue: boolean) {
    this.isLoading = true;
    this.categoriesService.setControllerName('Category/updateIsActive');
    const updateIsActive: CategoryIsActiveDto = {
      isActive: newValue,
      id: id,
    };
    this.categoriesService.update(updateIsActive as any).subscribe((result: any) => {
      const updatedIndex = this.categories.findIndex((c) => c.id === id);
      if (updatedIndex !== -1) {
        if (result.body.isActive) {
          this._alertService.success('Activated');
        } else {
          this._alertService.warn('DeActivated');
        }

        this.categories[updatedIndex] = result.body;
        this.categoryDialog = false;
        this.isLoading = false;
      }
    });
  }
  openNew() {
    this.submitted = false;
    this.categoryDialog = true;
  }

  editCategory(category: UpdateCategoryNamesDto) {
    this.category = { ...(category as CategoryDto) };
    this.categoryDialog = true;
  }

  deleteCategory(category: CategoryDto) {
    this._idToBeDeleted = category.id;
    this.category = { ...category };
    this.deleteCategoryDialog = true;
  }

  confirmDelete() {
    this.isLoading = true;
    this.categoriesService.setControllerName('Category');
    if (this._idToBeDeleted)
      this.categoriesService.delete(this._idToBeDeleted).subscribe(() => {
        const deletedIndex = this.categories.findIndex((c) => c.id == this._idToBeDeleted);
        if (deletedIndex !== -1) {
          this.categories.splice(deletedIndex, 1);
          this._idToBeDeleted = 0;
          this._alertService.success('category deleted.');
        }
        this.isLoading = false;
      });
    this.deleteCategoryDialog = false;
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
    this.category = {} as CategoryDto;
  }

  saveCategory() {
    this.isLoading = true;
    if (this.category.nameAr?.trim() && this.category.nameEn?.trim()) {
      if (this.category.id) {
        this.categoriesService.setControllerName('Category');
        this.categoriesService.update(this.category as any).subscribe((result) => {
          const updatedIndex = this.categories.findIndex((c) => c.id === this.category.id);
          if (updatedIndex !== -1 && result.code == +ResponseCode.Success) {
            this._alertService.success(result.message);
            this.categories[updatedIndex] = result.body as any;
            this.categoryDialog = false;
            this.submitted = true;
            this.category = {} as CategoryDto;
          }
          this.isLoading = false;
        });
      } else {
        this.categoriesService.setControllerName('Category');
        this.categoriesService.add(this.category as any).subscribe({
          next: (result) => {
            this._alertService.success(result.message);
            this.categories.push(result.body as any);
            this.submitted = true;
            this.category = {} as CategoryDto;
            this.categoryDialog = false;
          },
          complete: () => (this.isLoading = false),
        });
      }
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

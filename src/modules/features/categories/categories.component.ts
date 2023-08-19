import { Component, OnInit } from '@angular/core';
import { MessageService, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { GenericService } from 'src/core/services/generic.service';
import { CategoryDto } from './interfaces/category.dto';
import { CategoryIsActiveDto } from './interfaces/update-isActive-category.dto';
import { UpdateCategoryNamesDto } from './interfaces/update-category-names.dto';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
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
  constructor(private messageService: MessageService, private categoriesService: GenericService<CategoryDto>) {}

  ngOnInit() {
    this.categoriesService.setControllerName('Category');
    this.categoriesService.getAll().subscribe((data) => (this.categories = data));
    this.columns = [
      { field: 'id', header: 'Id', sortable: true },
      { field: 'nameEn', header: 'English Name', sortable: true },
      { field: 'nameAr', header: 'Arabic Name', sortable: true },
      { field: 'isActive', header: 'Is Active', sortable: true },
      { field: 'actions', header: '' },
    ];
    this.textColumns = this.columns.filter((col) => !(col.field === 'isActive' || col.field === 'actions'));

    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Dashboard', url: '/' });
    this.breadcrumbItems.push({ label: 'Categories' });
  }
  onToggleSwitch(id: number, newValue: boolean) {
    this.categoriesService.setControllerName('Category/updateIsActive');
    const updateIsActive: CategoryIsActiveDto = {
      isActive: newValue,
      id: id,
    };
    this.categoriesService.update(updateIsActive as CategoryDto).subscribe((data) => {
      const updatedIndex = this.categories.findIndex((c) => c.id === this.category.id);
      if (updatedIndex !== -1) {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Button Updated',
          life: 3000,
        });
        this.categories[updatedIndex] = data;
        this.categoryDialog = false;
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
    this.categoriesService.setControllerName('Category');
    if (this._idToBeDeleted)
      this.categoriesService.delete(this._idToBeDeleted).subscribe(() => {
        const deletedIndex = this.categories.findIndex((c) => c.id == this._idToBeDeleted);
        if (deletedIndex !== -1) {
          this.categories.splice(deletedIndex, 1);
          this._idToBeDeleted = 0;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Category Deleted',
            life: 3000,
          });
        }
      });
    this.deleteCategoryDialog = false;
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
    this.category = {} as CategoryDto;
  }

  saveCategory() {
    if (this.category.nameAr?.trim() && this.category.nameEn?.trim()) {
      if (this.category.id) {
        this.categoriesService.setControllerName('Category');
        this.categoriesService.update(this.category).subscribe((data) => {
          const updatedIndex = this.categories.findIndex((c) => c.id === this.category.id);
          if (updatedIndex !== -1) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Category Updated',
              life: 3000,
            });
            this.categories[updatedIndex] = data;
            this.categoryDialog = false;
            this.submitted = true;
            this.category = {} as CategoryDto;
            this.categoryDialog = false;
          }
        });
      } else {
        this.categoriesService.setControllerName('Category');
        this.categoriesService.add(this.category).subscribe({
          next: (data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Category Created',
              life: 3000,
            });
            this.categories.push(data);
            this.submitted = true;
            this.category = {} as CategoryDto;
            this.categoryDialog = false;
          },
        });
      }
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
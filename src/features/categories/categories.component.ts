import { Categories } from './interfaces/categories';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product } from '../dashboard/product';
import { ProductService } from '../dashboard/product.service';
import { GenericService } from 'src/core/services/generic.service';

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

  deleteProductsDialog: boolean = false;

  categories: Categories[] = [];
  products: Product[] = [];
  category: Categories = {
    id: 0,
    isActive: false,
    nameAr: '',
    nameEn: '',
  };
  product: Product = {};

  selectedProducts: Product[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private categoriesService: GenericService<Categories>
  ) {}

  ngOnInit() {
    this.categoriesService.setControllerName('Category');
    this.categoriesService.getAll().subscribe((data) => {
      this.categories = data;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Categories Received',
        life: 3000,
      });
    });
    this.cols = [
      { field: 'Id', header: 'Id' },
      { field: 'NameEn', header: 'NameEn' },
      { field: 'NameAr', header: 'NameAr' },
      { field: 'isActive', header: 'isActive' },
    ];

    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Dashboard' });
    this.breadcrumbItems.push({ label: 'Categories' });
  }
  onToggleSwitch(id: number, newValue: boolean) {
    this.categoriesService.setControllerName('Category/updateIsActive');
    const updateIsActive: Categories = {
      isActive: newValue,
      id: id,
      nameAr: '',
      nameEn: '',
    };
    this.categoriesService.update(updateIsActive).subscribe((data) => {
      const updatedIndex = this.categories.findIndex(
        (c) => c.id === this.category.id
      );
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
    this.product = {};
    this.submitted = false;
    this.categoryDialog = true;
  }
  // not need this code
  deleteSelectedProducts() {
    this.deleteProductsDialog = true;
  }
  //
  editCategory(category: Categories) {
    this.category = { ...category };
    this.categoryDialog = true;
  }

  deleteCategory(id: number) {
    this._idToBeDeleted = id;
    this.deleteCategoryDialog = true;
  }

  // this code is not needed
  confirmDeleteSelected() {
    this.deleteProductsDialog = false;
    this.products = this.products.filter(
      (val) => !this.selectedProducts.includes(val)
    );
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Products Deleted',
      life: 3000,
    });
    this.selectedProducts = [];
  }
  ///
  confirmDelete() {
    this.categoriesService.setControllerName('Category');
    if (this._idToBeDeleted) 
      this.categoriesService.delete(this._idToBeDeleted).subscribe((date) => {
        const deletedIndex = this.categories.findIndex(
          (c) => c.id == this._idToBeDeleted
        );
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
  }

  saveCategory() {
    this.submitted = true;
    if (this.category.nameAr?.trim() && this.category.nameEn?.trim()) {
      if (this.category.id) {
        this.categoriesService.setControllerName('Category');
        this.categoriesService.update(this.category).subscribe((data) => {
          const updatedIndex = this.categories.findIndex(
            (c) => c.id === this.category.id
          );
          if (updatedIndex !== -1) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Category Updated',
              life: 3000,
            });

            this.categories[updatedIndex] = data;

            this.categoryDialog = false;
          }
        });
      } else {
        this.categoriesService.setControllerName('Category');
        this.categoriesService.add(this.category).subscribe((data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Category Created',
            life: 3000,
          });
          this.categories.push(data);
        });
      }

      this.products = [...this.products];
      this.categoryDialog = false;
      this.product = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

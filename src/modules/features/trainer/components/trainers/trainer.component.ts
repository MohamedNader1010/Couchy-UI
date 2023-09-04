import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AlertService } from 'src/core/services/alert.service';
import { GenericService } from 'src/core/services/generic.service';
import { PermissionClaimsService } from 'src/core/services/permission-claims.service';
import { CategoryIsActiveDto } from 'src/modules/features/categories/interfaces/update-isActive-category.dto';
import { PermissionClaims } from 'src/modules/shared/enums/permissionClaims.enum';
import { AddTrainer } from 'src/modules/shared/interfaces/addTrainer.interface';
import { Users } from 'src/modules/shared/interfaces/users.interface';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss'],
})
export class TrainerComponent implements OnInit {
  claim: any;
  breadcrumbItems: MenuItem[] = [];
  trainers: Users[] = [];
  columns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  textColumns: any[] = [];
  trainerDialog: boolean = false;
  submitted: boolean = false;
  trainer: Users = {} as Users;
  constructor(
    private _trainerService: GenericService<Users[]>,
    private _alertService: AlertService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _permissionService: PermissionClaimsService,
  ) {
    this.claim = this._permissionService.getPermission(PermissionClaims.TrainerPermission);
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Dashboard', routerLink: '/' });
    this.breadcrumbItems.push({ label: 'Trainers' });
    this.columns = [
      { field: 'id', header: 'Id', sortable: true },
      { field: 'name', header: 'Trainer Name', sortable: true },
      { field: 'mobileNumber', header: 'Mobile Number', sortable: true },
      { field: 'isActive', header: 'Is Active', sortable: true },
      { field: 'packages&groups', header: 'Package & Groups', sortable: false },
    ];
    this.textColumns = this.columns.filter((col) => !(col.field === 'packages&groups' || col.field === 'isActive'));
  }
  ngOnInit(): void {
    this._trainerService.setControllerName('User/Trainer');
    this._trainerService.getAll().subscribe((result) => {
      result.body.forEach((trainer: any) => {
        console.log(trainer);
        this.trainers.push(trainer);
      });
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
    this._trainerService.setControllerName('User/UpdateIsActive');
    const updateIsActive: CategoryIsActiveDto = {
      isActive: newValue,
      id: id,
    };
    this._trainerService.update(updateIsActive as any).subscribe((result:any) => {
      const updatedIndex = this.trainers.findIndex((c) => c.id === id);
      if (updatedIndex !== -1) {
        if (result.body.isActive) {
          this._alertService.success('Activated');
        } else {
          this._alertService.warn('DeActivated');
        }

        this.trainers[updatedIndex] = result.body as any;
        this.trainerDialog = false;
      }
    });
  }
  hideDialog() {
    this.trainerDialog = false;
    this.submitted = false;
    this.trainer = {} as Users;
  }
  saveTrainer() {
    const trainerToBeAdded: AddTrainer = {phoneNumber: this.trainer.mobileNumber} as AddTrainer;
    this._trainerService.setControllerName('User/AddTrainer');
    this._trainerService.add(trainerToBeAdded as any).subscribe((result: any) => {
      this.trainers.push({ id: result.body.id, mobileNumber: result.body.mobileNumber } as Users);
      this.trainerDialog = false;
      this._alertService.success(result.message);
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

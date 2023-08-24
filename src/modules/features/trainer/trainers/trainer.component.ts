import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { GenericService } from 'src/core/services/generic.service';
import { Users } from 'src/modules/shared/interfaces/users.interface';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss'],
})
export class TrainerComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  trainers: Users[] = [];
  columns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  textColumns: any[] = [];
  trainerDialog: boolean = false;
  submitted: boolean = false;
  trainer: Users = {} as Users;
  constructor(private _trainerService: GenericService<Users[]>, private _messageService: MessageService) {
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Dashboard', routerLink: '/' });
    this.breadcrumbItems.push({ label: 'Trainers' });
    this.columns = [
      { field: 'id', header: 'Id', sortable: true },
      { field: 'name', header: 'Trainer Name', sortable: true },
      { field: 'phoneNumber', header: 'Phone Number', sortable: true },
    ];
    this.textColumns = this.columns.filter((col) => col);
  }
  ngOnInit(): void {
    this._trainerService.setControllerName('User/Trainer');
    this._trainerService.getAll().subscribe((result) => {
      result.body.forEach((trainer: any) => {
        this.trainers.push({
          name: trainer.name,
          phoneNumber: trainer.mobileNumber,
          id: trainer.id,
        });
      });
    });
  }
  openNew() {
    this.submitted = false;
    this.trainerDialog = true;
  }

  hideDialog() {
    this.trainerDialog = false;
    this.submitted = false;
    this.trainer = {} as Users;
  }
  saveTrainer() {
    this._trainerService.setControllerName('User/AddTrainerAsync');
    this._trainerService.add(this.trainer as any).subscribe((data:any) => {
      this.trainers.push({id: data.id, phoneNumber: data.mobileNumber} as Users);
      this.trainerDialog = false; 
      this._messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Trainer Added',
        life: 3000,
      });
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

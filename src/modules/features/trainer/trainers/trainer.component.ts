import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
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
  constructor(private _trainerService: GenericService<Users>) {
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Dashboard', routerLink: '/',  });
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
    this._trainerService.getAll().subscribe((data) => {
      data.forEach((trainer: any) => {
        this.trainers.push({
          name: trainer.name,
          phoneNumber: trainer.userName,
          id: trainer.id,
        });
      });
    });
  }
  openNew() {}
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

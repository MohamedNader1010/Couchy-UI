import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Settings } from '../interfaces/setttings.interface';
import { Table } from 'primeng/table';
import { GenericService } from 'src/core/services/generic.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  settings: Settings[] = [];
  columns: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  textColumns: any[] = [];
  settingDialog: boolean = false;
  submitted: boolean = false;
  setting: Settings = {} as Settings;

  constructor(private _settingService: GenericService<Settings>, private _messageService: MessageService) {
    this.breadcrumbItems = [];
    this.breadcrumbItems.push({ label: 'Dashboard', routerLink: '/' });
    this.breadcrumbItems.push({ label: 'Settings' });
  }

  ngOnInit(): void {
    this._settingService.setControllerName('ApplicationSetting');
    this._settingService.getAll().subscribe((data:any) => {
      this.setting = data;
      console.log(data);
    });
  }

  onSubmit(values:any) {
    this._settingService.update(this.setting).subscribe(data => console.log(data))
  }
  onFileUpload(value:any){}
  saveSettings() {}


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}

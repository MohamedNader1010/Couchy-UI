import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from 'src/modules/layout/layout-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }],
      },
      {
        label: 'Pages',
        items: [
          { label: 'Categories', icon: 'pi pi-fw pi-list', routerLink: ['/admin/categories'] },
          { label: 'Banars', icon: 'pi pi-fw pi-images', routerLink: ['/admin/banars'] },
          { label: 'Trainers', icon: 'pi pi-fw pi-users', routerLink: ['/admin/trainers'] },
          { label: 'Users', icon: 'pi pi-fw pi-users', routerLink: ['/admin/users'] },

        ],
      },
    ];
  }
}

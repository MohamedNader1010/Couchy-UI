import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from 'src/layout/layout-service.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Pages',
                items: [
                    { label: 'Categories', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/categories'] },
                ]
            }
        ];
    }
}

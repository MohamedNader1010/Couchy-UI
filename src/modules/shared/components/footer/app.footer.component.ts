import { Component } from '@angular/core';
import { LayoutService } from 'src/modules/layout/layout-service.service';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html'
})
export class AppFooterComponent {
    constructor(public layoutService: LayoutService) { }
}

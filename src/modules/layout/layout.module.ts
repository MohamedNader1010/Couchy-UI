import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { AppFooterComponent } from 'src/modules/shared/components/footer/app.footer.component';
import { AppMenuitemComponent } from 'src/modules/shared/components/menu-item/app.menuitem.component';
import { AppMenuComponent } from 'src/modules/shared/components/menu/app.menu.component';
import { AppSidebarComponent } from 'src/modules/shared/components/sidebar/app.sidebar.component';
import { AppTopBarComponent } from 'src/modules/shared/components/topbar/app.topbar.component';
import { AppLayoutComponent } from './layout.component';

@NgModule({
    declarations: [
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        // AppConfigModule
    ],
    exports: [AppLayoutComponent]
})
export class AppLayoutModule { }

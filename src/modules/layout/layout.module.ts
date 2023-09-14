import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { AppFooterComponent } from '../shared/components/footer/app.footer.component';
import { AppMenuitemComponent } from '../shared/components/menu-item/app.menuitem.component';
import { AppMenuComponent } from '../shared/components/menu/app.menu.component';
import { AppSidebarComponent } from '../shared/components/sidebar/app.sidebar.component';
import { AppTopBarComponent } from '../shared/components/topbar/app.topbar.component';
import { AppLayoutComponent } from './layout.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ThemesComponent } from '../shared/components/themes/themes.component';
import { LanguageComponent } from '../shared/components/language/language.component';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import {  TranslateModule, TranslatePipe } from '@ngx-translate/core';
@NgModule({
  declarations: [AppMenuitemComponent, AppTopBarComponent, AppFooterComponent, AppMenuComponent, AppSidebarComponent, AppLayoutComponent, ThemesComponent, LanguageComponent],
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
    DialogModule,
    RippleModule,
    ButtonModule,
    FormsModule,
    SidebarModule,
    RadioButtonModule,
    ButtonModule,
    InputSwitchModule,
    DropdownModule,
    AvatarModule,
    TranslateModule,
  ],
  exports: [AppLayoutComponent],
})
export class AppLayoutModule {}

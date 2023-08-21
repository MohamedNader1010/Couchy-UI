import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleRoutingModule } from './shared.module-routing.module';
import { DialogModule } from 'primeng/dialog';
import { AppTopBarComponent } from './components/topbar/app.topbar.component';




@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModuleRoutingModule,
  ]
})
export class SharedModuleModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleRoutingModule } from './shared.module-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [ 
  ],
  imports: [
    CommonModule,
    SharedModuleRoutingModule
  ]
})
export class SharedModuleModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleRoutingModule } from './shared.module-routing.module';
import { LanguageComponent } from './components/language/language.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ 
  ],
  imports: [
    CommonModule,
    SharedModuleRoutingModule,
  ]
})
export class SharedModuleModule { }

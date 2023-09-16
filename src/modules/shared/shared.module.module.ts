import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModuleRoutingModule } from './shared.module-routing.module';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';



@NgModule({
  declarations: [ 
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    SharedModuleRoutingModule, 
    ProgressSpinnerModule
  ], 
  exports: [SpinnerComponent]
})
export class SharedModuleModule { }

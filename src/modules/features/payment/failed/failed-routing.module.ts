import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FailedComponent } from './failed.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: FailedComponent }])],
  exports: [RouterModule],
})
export class FailedRoutingModule {}

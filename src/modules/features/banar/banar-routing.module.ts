import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BanarComponent } from './banar.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: BanarComponent }])],
  exports: [RouterModule],
})
export class BanarRoutingModule {}

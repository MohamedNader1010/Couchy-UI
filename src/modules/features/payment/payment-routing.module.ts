import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuccessComponent } from './success/success.component';
import { FailedComponent } from './failed/failed.component';

const routes: Routes = [
  { path: 'failed', loadChildren: () => import('./failed/failed.module').then((m) => m.FailedModule) },
  { path: 'success', loadChildren: () => import('./success/success.module').then((m) => m.SuccessModule) },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { NotfoundComponent } from 'src/modules/features/notfound/notfound.component';
import { AppLayoutComponent } from 'src/modules/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('../modules/features/dashboard/dashboard.module').then((m) => m.DashboardModule), canActivate: [AuthGuard] },
      {
        path: 'admin',
        loadChildren: () => import('../modules/features/features.module.module').then((f) => f.FeaturesModuleModule),
        canActivate: [AuthGuard],
      },
    ],
  },
  { path: 'auth', loadChildren: () => import('../modules/features/auth/auth.module').then((m) => m.AuthModule) },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

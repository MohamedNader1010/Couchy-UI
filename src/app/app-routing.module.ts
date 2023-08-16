import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from 'src/features/notfound/notfound.component';
import { AppLayoutComponent } from 'src/layout/layout.component';


const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      
      { path: '', loadChildren: () => import('../features/dashboard/dashboard.module').then(m => m.DashboardModule) },
      {
        path: 'admin',
        loadChildren: () =>
          import('../features/features.module.module').then(
            (f) => f.FeaturesModuleModule
          ),
      },
    ],
  },
  { path: 'auth', loadChildren: () => import('../features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

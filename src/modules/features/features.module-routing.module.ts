import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then((m) => m.CategoriesModule),
  },
  {
    path: 'banars',
    loadChildren: () => import('./banar/banar.module').then((m) => m.BanarModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'trainers',
    loadChildren: () => import('./trainer/trainer.module').then((m) => m.TrainerModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'messages',
    loadChildren: () => import('./message/message.module').then((m) => m.MessageModule),
  },
  {
    path: 'settings', 
    loadChildren: () => import ('./settings/settings.module').then((m) => m.SettingsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturesModuleRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardClass } from 'src/core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then((m) => m.PaymentModule),
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then((m) => m.CategoriesModule),
    canActivate: [AuthGuardClass],
  },
  {
    path: 'banars',
    loadChildren: () => import('./banar/banar.module').then((m) => m.BanarModule),
    canActivate: [AuthGuardClass],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [AuthGuardClass],
  },
  {
    path: 'trainers',
    loadChildren: () => import('./trainer/trainer.module').then((m) => m.TrainerModule),
    canActivate: [AuthGuardClass],
  },
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    canActivate: [AuthGuardClass],
  },
  {
    path: 'messages',
    loadChildren: () => import('./message/message.module').then((m) => m.MessageModule),
    canActivate: [AuthGuardClass],
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule),
    canActivate: [AuthGuardClass],
  },
  {
    path: 'admins',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuardClass],
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [AuthGuardClass],
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notification/notification.module').then((m) => m.NotificationModule),
    canActivate: [AuthGuardClass],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturesModuleRoutingModule {}

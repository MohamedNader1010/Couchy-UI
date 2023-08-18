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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesModuleRoutingModule { }

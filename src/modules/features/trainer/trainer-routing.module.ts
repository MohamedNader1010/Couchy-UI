import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainerComponent } from './components/trainers/trainer.component';
import { PackagesComponent } from './components/packages/packages.component';
import { GroupsComponent } from './components/groups/groups.component';

const routes: Routes = [
  { path: '', component: TrainerComponent },
  { path: 'packages', component: PackagesComponent },
  { path: 'groups', component: GroupsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainerRoutingModule {}

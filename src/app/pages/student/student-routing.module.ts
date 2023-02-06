import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "@pages/student/dashboard/dashboard.component";
import {SettingsComponent} from "@pages/settings/settings/settings.component";

const routes: Routes = [{
  path: '',
  redirectTo: 'dashboard',
  pathMatch: 'full',
},
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent
  },
  {
    path: 'settings',
    title: 'Settings',
    component: SettingsComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {
}

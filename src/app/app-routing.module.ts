import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserSettingsComponent } from './components/user-settings.component';
import { StartComponent } from './components/start.component';

const appRoutes: Routes = [
  {path: '', component: StartComponent},
  {path: 'user-settings', component: UserSettingsComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}

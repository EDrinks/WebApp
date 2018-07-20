import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserSettingsComponent } from './components/user-settings.component';
import { StartComponent } from './components/start.component';
import { ContributionsComponent } from './components/contributions.component';
import { ProductListComponent } from './components/products/product-list.component';
import { ServerErrorComponent } from './components/errors/server-error.component';

const appRoutes: Routes = [
  {path: '', component: StartComponent},
  {path: 'user-settings', component: UserSettingsComponent},
  {path: 'contributions', component: ContributionsComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: 'products', component: ProductListComponent}
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

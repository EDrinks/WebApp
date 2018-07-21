import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserSettingsComponent } from './components/user-settings.component';
import { StartComponent } from './components/start.component';
import { ContributionsComponent } from './components/contributions.component';
import { ProductListComponent } from './components/products/product-list.component';
import { ServerErrorComponent } from './components/errors/server-error.component';
import { NotFoundErrorComponent } from './components/errors/not-found-error.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductAddComponent } from './components/products/product-add.component';
import { ProductEditComponent } from './components/products/product-edit.component';

const appRoutes: Routes = [
  {path: '', component: StartComponent},
  {path: 'user-settings', component: UserSettingsComponent},
  {path: 'contributions', component: ContributionsComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: 'not-found-error', component: NotFoundErrorComponent},
  {
    path: 'products', component: ProductsComponent, children: [
      {
        path: '', redirectTo: 'list', pathMatch: 'full'
      },
      {
        path: 'list', component: ProductListComponent
      },
      {
        path: 'add', component: ProductAddComponent
      },
      {
        path: 'edit/:id', component: ProductEditComponent
      }
    ]
  }
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

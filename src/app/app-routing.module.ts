import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserSettingsComponent } from './components/user-settings.component';
import { StartComponent } from './components/start.component';
import { ContributionsComponent } from './components/contributions.component';
import { ProductListComponent } from './components/products/product-list.component';
import { ServerErrorComponent } from './components/errors/server-error.component';
import { NotFoundErrorComponent } from './components/errors/not-found-error.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductMaskComponent } from './components/products/product-mask.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabListComponent } from './components/tabs/tab-list.component';
import { TabMaskComponent } from './components/tabs/tab-mask.component';

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
        path: 'add', component: ProductMaskComponent
      },
      {
        path: 'edit/:id', component: ProductMaskComponent
      }
    ]
  },
  {
    path: 'tabs', component: TabsComponent, children: [
      {
        path: '', redirectTo: 'list', pathMatch: 'full'
      },
      {
        path: 'list', component: TabListComponent
      },
      {
        path: 'add', component: TabMaskComponent
      },
      {
        path: 'edit/:id', component: TabMaskComponent
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

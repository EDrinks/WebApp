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
import { TabOrderComponent } from './components/orders/tab-order.component';
import { SettlementsComponent } from './components/settlements/settlements.component';
import { ActiveSettlementComponent } from './components/settlements/active-settlement.component';
import { OldSettlementComponent } from './components/settlements/old-settlement.component';
import { AllSettlementsComponent } from './components/settlements/all-settlements.component';
import { ImpressumComponent } from './components/impressum.component';
import { LoginComponent } from './components/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SpendingOrderComponent } from './components/orders/spending-order.component';

const appRoutes: Routes = [
  {path: '', component: StartComponent, canActivate: []},
  {path: 'login', component: LoginComponent},
  {path: 'tab/:id', component: TabOrderComponent, canActivate: [AuthGuardService]},
  {path: 'spending/:id', component: SpendingOrderComponent, canActivate: [AuthGuardService]},
  {path: 'user-settings', component: UserSettingsComponent, canActivate: [AuthGuardService]},
  {path: 'contributions', component: ContributionsComponent},
  {path: 'impressum', component: ImpressumComponent},
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
    ], canActivate: [AuthGuardService]
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
    ], canActivate: [AuthGuardService]
  },
  {
    path: 'settlements', component: SettlementsComponent, children: [
      {
        path: '', redirectTo: 'active', pathMatch: 'full',
      },
      {
        path: 'active', component: ActiveSettlementComponent
      },
      {
        path: 'all', component: AllSettlementsComponent
      },
      {
        path: 'old/:settlementId', component: OldSettlementComponent
      }
    ], canActivate: [AuthGuardService]
  },
  {
    path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuardService]
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

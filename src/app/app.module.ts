import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppConfigService } from './services/app-config.service';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UserSettingsComponent } from './components/user-settings.component';
import { AppRoutingModule } from './app-routing.module';
import { StartComponent } from './components/start.component';
import { FormsModule } from '@angular/forms';
import { ContributionsComponent } from './components/contributions.component';
import { ProductListComponent } from './components/products/product-list.component';
import { BackendService } from './services/backend.service';
import { ServerErrorComponent } from './components/errors/server-error.component';
import { NotFoundErrorComponent } from './components/errors/not-found-error.component';
import { ProductsComponent } from './components/products/products.component';
import { ValidationErrorComponent } from './components/shared/validation-error.component';
import { PricePipe } from './pipes/price.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductDeleteModalComponent } from './components/products/product-delete-modal.component';
import { ProductMaskComponent } from './components/products/product-mask.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabListComponent } from './components/tabs/tab-list.component';
import { TabMaskComponent } from './components/tabs/tab-mask.component';
import { TabDeleteModalComponent } from './components/tabs/tab-delete-modal.component';
import { TabOrderComponent } from './components/orders/tab-order.component';
import { LoadingComponent } from './components/shared/loading.component';
import { UserSettingsService } from './services/user-settings.service';
import { LocaleDatePipe } from './pipes/locale-date.pipe';
import { AuthService } from './services/auth.service';
import { CallbackComponent } from './callback.component';
import { AuthInterceptor } from './misc/auth-interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    UserSettingsComponent,
    StartComponent,
    ContributionsComponent,
    ServerErrorComponent,
    NotFoundErrorComponent,
    ValidationErrorComponent,
    ProductsComponent,
    ProductListComponent,
    ProductMaskComponent,
    ProductDeleteModalComponent,
    TabsComponent,
    TabListComponent,
    TabMaskComponent,
    TabDeleteModalComponent,
    TabOrderComponent,
    LoadingComponent,
    CallbackComponent,
    // pipes
    PricePipe,
    LocaleDatePipe
  ],
  entryComponents: [
    ProductDeleteModalComponent,
    TabDeleteModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: AppConfigService) => () => {
        return config.load();
      },
      deps: [AppConfigService],
      multi: true
    },
    BackendService,
    UserSettingsService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

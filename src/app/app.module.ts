import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppConfigService } from './services/app-config.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
import { ProductAddComponent } from './components/products/product-add.component';

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
    ProductsComponent,
    ProductListComponent,
    ProductAddComponent
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
    BackendService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

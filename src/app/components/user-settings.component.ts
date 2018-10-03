import { Component, OnInit } from '@angular/core';
import { DATE_FORMAT, LANGUAGE } from '../constants';
import { Product } from '../services/model/Product';
import { BackendService } from '../services/backend.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html'
})
export class UserSettingsComponent implements OnInit {
  language = {key: '', dateFormat: ''};
  languages = [
    {
      key: 'en',
      label: 'English',
      dateFormat: 'short'
    },
    {
      key: 'de',
      label: 'Deutsch',
      dateFormat: 'd.M.yy H:mm'
    }
  ];

  primaryProductId: string = null;
  enableQuickSelect = false;

  products: Product[] = [];
  loadingProducts = false;
  loadingProductsError = '';

  constructor(private service: BackendService) {
  }

  ngOnInit() {
    this.loadProducts();

    let storedLanguage = localStorage.getItem(LANGUAGE);
    if (!storedLanguage) {
      storedLanguage = 'en';
    }

    this.language = this.languages.find((e) => {
      return e.key === storedLanguage;
    });

    if (!this.language) {
      this.language = this.languages[0];
    }
  }

  saveSettings() {
    localStorage.setItem(LANGUAGE, this.language.key);
    localStorage.setItem(DATE_FORMAT, this.language.dateFormat);

    location.reload();
  }

  private loadProducts() {
    this.loadingProducts = true;
    this.loadingProductsError = '';

    this.service.getProducts()
      .pipe(finalize(() => {
        this.loadingProducts = false;
      }))
      .subscribe((products: Product[]) => {
        this.products = products;
      }, (error) => {
        this.loadingProductsError = error;
      });
  }
}

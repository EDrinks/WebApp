import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { finalize } from 'rxjs/operators';
import { Product } from '../../services/model/Product';

@Component({
  selector: 'app-tab-order',
  templateUrl: './tab-order.component.html',
  styleUrls: ['./tab-order.component.scss']
})
export class TabOrderComponent implements OnInit {
  products: Product[] = [];
  productsLoading = false;
  productsError = '';
  noProductsFound = false;

  constructor(private service: BackendService) {
  }

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    this.productsLoading = true;

    this.service.getProducts()
      .pipe(finalize(() => {
        this.productsLoading = false;
      }))
      .subscribe((products: Product[]) => {
        this.products = products;
        this.noProductsFound = products.length === 0;
      }, (error) => {
        this.productsError = error;
      });
  }
}

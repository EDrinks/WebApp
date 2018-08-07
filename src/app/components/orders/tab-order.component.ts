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
  noProductsFound = false;

  products: Product[] = [];
  selectedProduct: Product;
  productsLoading = false;
  productsError = '';

  constructor(private service: BackendService) {
  }

  ngOnInit() {
    this.loadProducts();
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
  }

  private loadProducts() {
    this.productsLoading = true;

    this.service.getProducts()
      .pipe(finalize(() => {
        this.productsLoading = false;
      }))
      .subscribe((products: Product[]) => {
        this.products = products;

        if (products.length > 0) {
          this.selectedProduct = products[0];
        } else {
          this.noProductsFound = true;
        }
      }, (error) => {
        this.productsError = error;
      });
  }
}

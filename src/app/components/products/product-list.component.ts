import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Product } from '../../services/model/Product';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  loading = false;
  errorMessage = '';
  products: Product[] = [];

  constructor(private service: BackendService) {
  }

  ngOnInit() {
    this.loading = true;

    this.service.getProducts()
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((products: Product[]) => {
        this.products = products;
      }, (error) => {
        this.errorMessage = error;
      });
  }
}

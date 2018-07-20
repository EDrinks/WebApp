import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Product } from '../../services/model/Product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {

  constructor(private service: BackendService) {
  }

  ngOnInit() {
    this.service.getProducts()
      .subscribe((products: Product[]) => {
        console.log(products);
      }, (error) => {
        console.log(error);
      });
  }
}

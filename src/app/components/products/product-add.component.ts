import { Component } from '@angular/core';
import { Product } from '../../services/model/Product';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html'
})
export class ProductAddComponent {
  product = new Product();

  onSave() {
    console.log('save product');
  }
}

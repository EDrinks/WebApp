import { Component, Input } from '@angular/core';
import { Product } from '../../services/model/Product';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-mask',
  templateUrl: './product-mask.component.html',
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class ProductMaskComponent {
  @Input() product: Product;
}

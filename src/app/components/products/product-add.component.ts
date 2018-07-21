import { Component } from '@angular/core';
import { Product } from '../../services/model/Product';
import { BackendService } from '../../services/backend.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html'
})
export class ProductAddComponent {
  product = new Product();
  submitting = false;
  error: any;

  constructor(private service: BackendService, private router: Router) {
  }

  onSave() {
    this.submitting = true;

    this.service.createProduct(this.product)
      .pipe(finalize(() => {
        this.submitting = false;
      }))
      .subscribe(() => {
        this.router.navigate(['/products', 'list']);
      }, (error) => {
        this.error = error;
      });
  }
}

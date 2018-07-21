import { Component, OnInit } from '@angular/core';
import { Product } from '../../services/model/Product';
import { BackendService } from '../../services/backend.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent implements OnInit {
  product: Product;
  loading = false;
  submitting = false;
  error: any;

  constructor(private service: BackendService, private activatedRoute: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.loadProduct(params['id']);
    });
  }

  onSave() {
    this.submitting = true;

    this.service.updateProduct(this.product)
      .pipe(finalize(() => {
        this.submitting = false;
      }))
      .subscribe(() => {
        this.router.navigate(['/products', 'list']);
      }, (error) => {
        this.error = error;
      });
  }

  private loadProduct(productId: string) {
    this.loading = true;

    this.service.getProduct(productId)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((product: Product) => {
        this.product = product;
      });
  }
}

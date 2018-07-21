import { Component, OnInit } from '@angular/core';
import { Product } from '../../services/model/Product';
import { BackendService } from '../../services/backend.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-mask',
  templateUrl: './product-mask.component.html'
})
export class ProductMaskComponent implements OnInit {
  product: Product;
  createMode = true;
  loading = false;
  submitting = false;
  error: any;

  constructor(private service: BackendService, private activatedRoute: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.loadProduct(params['id']);
        this.createMode = false;
      } else {
        this.product = new Product();
      }
    });
  }

  onSave() {
    this.submitting = true;

    const observable = this.createMode ? this.service.createProduct(this.product) : this.service.updateProduct(this.product);

    observable
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

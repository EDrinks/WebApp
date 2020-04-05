import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Product } from '../../services/model/Product';
import { finalize } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductDeleteModalComponent } from './product-delete-modal.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  loading = false;
  errorMessage = '';
  products: Product[] = [];

  @ViewChild('content', { static: false }) content;

  constructor(private service: BackendService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.loadProducts();
  }

  confirmDeleteProduct(product: Product) {
    const modal = this.modalService.open(ProductDeleteModalComponent);
    modal.componentInstance.product = product;

    modal.result.then((deletedProduct: Product) => {
      this.products = this.products.filter((prod) => {
        return prod.id !== deletedProduct.id;
      });
    }, () => undefined);
  }

  private loadProducts() {
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

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../../services/model/Product';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-product-delete-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{'product.confirm-delete-product' | translate}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <h3>{{product?.name}}</h3>
    </div>
    <div class="modal-footer">
      <div class="alert alert-danger" *ngIf="errorMessage">{{errorMessage}}</div>
      <button type="button" class="btn btn-danger" (click)="deleteProduct()" [disabled]="deleting">
        <span *ngIf="deleting"><i class="fas fa-spinner"></i></span>
        {{'common.delete' | translate}}
      </button>
    </div>
  `
})
export class ProductDeleteModalComponent {
  product: Product;
  deleting = false;
  errorMessage = '';

  constructor(public activeModal: NgbActiveModal, private service: BackendService) {
  }

  deleteProduct() {
    this.deleting = true;

    this.service.deleteProduct(this.product.id)
      .subscribe(() => {
        this.activeModal.close(this.product);
      }, (error) => {
        this.errorMessage = error;
      });
  }
}

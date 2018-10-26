import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { finalize } from 'rxjs/operators';
import { Product } from '../../services/model/Product';

@Component({
  selector: 'app-create-spending',
  templateUrl: './create-spending-mask.component.html'
})
export class CreateSpendingMaskComponent {
  @Input() tabId: string;
  @Input() product: Product;

  @Output() spendingCreated = new EventEmitter();

  spendingSize = 0;
  loading = false;
  error = '';

  constructor(private service: BackendService) {
  }

  createSpending() {
    this.loading = true;
    this.error = '';

    this.service.createSpending(this.tabId, this.product.id, this.spendingSize)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(() => {
        this.spendingCreated.emit();
      }, (error) => {
        this.error = error;
      });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Settlement, TabToOrders } from '../../services/model/Settlement';
import { Order } from '../../services/model/Order';

@Component({
  selector: 'app-old-settlement',
  templateUrl: './old-settlement.component.html'
})
export class OldSettlementComponent implements OnInit, OnDestroy {
  loading = false;
  errorMessage = '';
  settlement: Settlement;

  private ngUnsubscribe = new Subject<void>();

  constructor(private service: BackendService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.loadSettlement(params['settlementId']);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getSumOfTab(tabToOrders: TabToOrders) {
    return tabToOrders.orders.reduce((sum: number, order: Order) => {
      return sum + (order.quantity * order.productPrice);
    }, 0);
  }

  private loadSettlement(settlementId: string) {
    this.loading = true;
    this.errorMessage = '';
    this.settlement = null;

    this.service.getSettlement(settlementId)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((settlement: Settlement) => {
        this.settlement = settlement;
      }, (error) => {
        this.errorMessage = error;
      });
  }
}

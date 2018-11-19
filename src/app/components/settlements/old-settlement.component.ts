import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Settlement, TabToOrders } from '../../services/model/Settlement';
import { Order } from '../../services/model/Order';
import * as moment from 'moment';

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

  downloadAsXlsx() {
    const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    this.service.getSettlementFile(this.settlement.id, mimeType)
      .subscribe((data) => {
        this.downloadFile(data, mimeType, `${moment(this.settlement.dateTime).format('YYYY-MM-DD')}.xlsx`);
      });
  }

  private downloadFile(data: any, mimeType: string, fileName: string) {
    const blob = new Blob([data], {type: mimeType});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove(); // remove the element
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

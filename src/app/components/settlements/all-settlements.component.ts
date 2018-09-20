import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BackendService } from '../../services/backend.service';
import { Settlement, TabToOrders } from '../../services/model/Settlement';
import { finalize } from 'rxjs/operators';
import { Order } from '../../services/model/Order';

const dateFormat = 'YYYY-MM-DD';

@Component({
  selector: 'app-all-settlements',
  templateUrl: './all-settlements.component.html'
})
export class AllSettlementsComponent implements OnInit {

  loading = false;
  errorMessage = '';
  formData = {
    fromDate: '',
    toDate: ''
  };

  settlements: Settlement[] = [];
  offset = 0;

  constructor(private service: BackendService) {

  }

  ngOnInit() {
    this.formData.fromDate = moment().subtract(2, 'weeks').format(dateFormat);
    this.formData.toDate = moment().format(dateFormat);

    this.loadSettlements();
  }

  loadSettlements() {
    if (!this.formData.fromDate || !this.formData.toDate) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.service.getSettlements(this.offset)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((settlements: Settlement[]) => {
        this.settlements = this.settlements.concat(settlements);
      }, (error) => {
        this.errorMessage = error;
      });
  }

  loadNextPage() {
    this.offset += 1;
    this.loadSettlements();
  }

  getSumOfSettlement(settlement: Settlement) {
    return settlement.tabToOrders.reduce((sum: number, tabToOrders: TabToOrders) => {
      return sum + tabToOrders.orders.reduce((orderSum: number, order: Order) => {
        return orderSum + (order.quantity * order.productPrice);
      }, 0);
    }, 0);
  }
}

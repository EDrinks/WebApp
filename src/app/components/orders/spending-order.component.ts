import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { Spending } from '../../services/Spending';
import { zip } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Tab } from '../../services/model/Tab';
import { Product } from '../../services/model/Product';
import { Order } from '../../services/model/Order';
import * as moment from 'moment';

@Component({
  selector: 'app-spending-order',
  templateUrl: './spending-order.component.html'
})
export class SpendingOrderComponent implements OnInit {
  loading = false;
  error = '';
  spendingId = null;
  spending: Spending;
  tab: Tab;
  product: Product;

  orders: Order[] = [];
  loadingOrders = false;
  ordersError = '';

  orderButtons = [1, 2, 3, 4, 5];
  ordering = false;
  orderingError = '';

  deleting = false;
  deletingError = '';

  constructor(private activatedRoute: ActivatedRoute, private service: BackendService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.spendingId = params['id'];
      this.loadData();
      this.loadOrders();
    });
  }

  orderOnSpending(quantity: number) {
    this.ordering = true;
    this.orderingError = '';

    this.service.orderOnSpending(this.spendingId, quantity)
      .pipe(finalize(() => {
        this.ordering = false;
      }))
      .subscribe(() => {
        this.spending.current += quantity;
        this.updateSpending();
        this.loadOrders();
      }, (error) => {
        this.orderingError = error;
      });
  }

  undoOrder() {
    if (this.orders.length > 0) {
      this.deleting = true;
      this.deletingError = '';

      const order = this.orders[0];

      this.service.deleteOrder(order.tabId, order.id)
        .pipe(finalize(() => {
          this.deleting = false;
        }))
        .subscribe(() => {
          this.loadOrders();
          this.updateSpending();
        }, (error) => {
          this.deletingError = error;
        });
    }
  }

  private updateSpending() {
    this.service.getSpending(this.spendingId)
      .subscribe((spending: Spending) => {
        this.spending = spending;
      });
  }

  private loadData() {
    this.loading = true;
    this.error = '';

    this.service.getSpending(this.spendingId)
      .subscribe((spending: Spending) => {
        this.spending = spending;
        const prod = this.service.getProduct(spending.productId);
        const tab = this.service.getTab(spending.tabId);

        zip(prod, tab)
          .pipe(finalize(() => {
            this.loading = false;
          }))
          .subscribe((val) => {
            this.product = val[0];
            this.tab = val[1];
          }, (error) => {
            this.error = error;
          });
      }, (error) => {
        this.error = error;
        this.loading = false;
      });
  }

  private loadOrders() {
    this.loadingOrders = true;
    this.ordersError = '';

    this.service.getSpendingOrders(this.spendingId)
      .pipe(finalize(() => {
        this.loadingOrders = false;
      }))
      .subscribe((orders: Order[]) => {
        this.orders = orders.sort((a: Order, b: Order) => {
          if (moment(a.dateTime).isBefore(b.dateTime)) {
            return 1;
          }

          return -1;
        });
      }, (error) => {
        this.ordersError = error;
      });
  }
}

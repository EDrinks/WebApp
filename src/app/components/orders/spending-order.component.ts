import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { Spending } from '../../services/Spending';
import { zip } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Tab } from '../../services/model/Tab';
import { Product } from '../../services/model/Product';

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

  orderButtons = [1, 2, 3, 4, 5];
  ordering = false;
  orderingError = '';

  constructor(private activatedRoute: ActivatedRoute, private service: BackendService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.spendingId = params['id'];
      this.loadData();
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

        this.service.getSpending(this.spendingId)
          .subscribe((spending: Spending) => {
            this.spending = spending;
          });
      }, (error) => {
        this.orderingError = error;
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
}

import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Tab } from '../services/model/Tab';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PRIMARY_PRODUCT, QUICK_SELECT } from '../constants';
import { Product } from '../services/model/Product';
import { Spending } from '../services/Spending';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  tabs: Tab[] = [];
  products: Product[] = [];
  tabsLoading = false;
  tabsError = '';
  spendingsLoading = false;
  spendingsError = '';
  spendings: Spending[] = [];
  disabledSpendings = {};

  quickSelectProduct: string = null;
  tabOrdersInProgress = {};
  orderError = '';
  productsError = '';

  lastOrders: LastOrder[] = [];
  deletingOrder = false;
  deletingOrderError = '';

  tabIdToName = {};
  productIdToName = {};

  constructor(private service: BackendService, private router: Router) {
  }

  ngOnInit() {
    this.loadTabs();
    this.loadProducts();
    this.loadSpendings();

    if (localStorage.getItem(QUICK_SELECT) === '1') {
      this.quickSelectProduct = localStorage.getItem(PRIMARY_PRODUCT);
    }
  }

  selectTab(tab: Tab) {
    this.router.navigate(['tab', tab.id]);
  }

  selectSpending(spending: Spending) {
    this.router.navigate(['spending', spending.id]);
  }

  quickOrder(tab: Tab) {
    if (this.quickSelectProduct) {
      this.tabOrdersInProgress[tab.id] = true;
      this.orderError = '';

      this.service.createOrder(tab.id, this.quickSelectProduct, 1)
        .pipe(finalize(() => {
          this.tabOrdersInProgress[tab.id] = false;
        }))
        .subscribe((orderId: string) => {
          const product = this.products.find((prod: Product) => {
            return prod.id === this.quickSelectProduct;
          });
          this.lastOrders.splice(0, 0, {
            tabId: tab.id,
            tabName: tab.name,
            orderId: orderId,
            productName: product ? product.name : '',
            spendingId: null
          });
        }, (error) => {
          this.orderError = error;
        });
    }
  }

  orderOnSpending(spending: Spending) {
    this.disabledSpendings[spending.id] = true;
    this.spendingsError = '';

    spending.current += 1;
    this.service.orderOnSpending(spending.id, 1)
      .pipe(finalize(() => {
        this.disabledSpendings[spending.id] = false;
      }))
      .subscribe((orderId: string) => {
        this.loadSpending(spending.id);
        this.lastOrders.splice(0, 0, {
          tabId: spending.tabId,
          tabName: this.tabIdToName[spending.tabId],
          orderId: orderId,
          productName: this.productIdToName[spending.productId],
          spendingId: spending.id
        });
      }, (error) => {
        this.spendingsError = error;
      });
  }

  undoLastOrder() {
    if (this.lastOrders.length > 0) {
      const lastOrder = this.lastOrders[0];

      this.deletingOrder = true;
      this.deletingOrderError = '';
      this.service.deleteOrder(lastOrder.tabId, lastOrder.orderId)
        .pipe(finalize(() => {
          this.deletingOrder = false;
        }))
        .subscribe(() => {
          this.lastOrders.splice(0, 1);

          if (lastOrder.spendingId) {
            this.loadSpending(lastOrder.spendingId);
          }
        }, (error) => {
          this.deletingOrderError = error;
        });
    }
  }

  private loadTabs() {
    this.tabsLoading = true;
    this.tabsError = '';

    this.service.getTabs()
      .pipe(finalize(() => {
        this.tabsLoading = false;
      }))
      .subscribe((tabs: Tab[]) => {
        this.tabs = tabs;
        this.tabIdToName = tabs.reduce((mapping: any, tab: Tab) => {
          mapping[tab.id] = tab.name;
          return mapping;
        }, {});
      }, (error) => {
        this.tabsError = error;
      });
  }

  private loadProducts() {
    this.productsError = '';

    this.service.getProducts()
      .subscribe((products: Product[]) => {
        this.products = products;
        this.productIdToName = products.reduce((mapping: any, product: Product) => {
          mapping[product.id] = product.name;
          return mapping;
        }, {});
      }, (error) => {
        this.productsError = error;
      });
  }

  private loadSpending(spendingId: string) {
    this.spendingsError = '';

    this.service.getSpending(spendingId)
      .subscribe((spending: Spending) => {
        const index = this.spendings.findIndex((spend: Spending) => {
          return spend.id === spendingId;
        });

        if (index >= 0 && spending.current >= spending.quantity) {
          this.spendings.splice(index, 1);
        } else if (index >= 0) {
          this.spendings.splice(index, 1, spending);
        } else if (index < 0 && spending.current < spending.quantity) {
          this.spendings.push(spending);
        }
      }, (error) => {
        this.spendingsError = error;
      });
  }

  private loadSpendings() {
    this.spendingsLoading = true;
    this.spendingsError = '';

    this.service.getSpendings()
      .pipe(finalize(() => {
        this.spendingsLoading = false;
      }))
      .subscribe((spendings: Spending[]) => {
        this.spendings = spendings;
      }, (error) => {
        this.spendingsError = error;
      });
  }
}

class LastOrder {
  tabId: string;
  tabName: string;
  orderId: string;
  productName: string;
  spendingId: string;
}

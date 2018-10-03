import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Tab } from '../services/model/Tab';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PRIMARY_PRODUCT, QUICK_SELECT } from '../constants';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  tabs: Tab[] = [];
  tabsLoading = false;
  tabsError = '';

  quickSelectProduct: string = null;
  tabOrdersInProgress = {};
  orderError = '';

  lastOrders: LastOrder[] = [];
  deletingOrder = false;
  deletingOrderError = '';

  constructor(private service: BackendService, private router: Router) {
  }

  ngOnInit() {
    this.loadTabs();

    if (localStorage.getItem(QUICK_SELECT) === '1') {
      this.quickSelectProduct = localStorage.getItem(PRIMARY_PRODUCT);
    }
  }

  selectTab(tab: Tab) {
    this.router.navigate(['tab', tab.id]);
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
          this.lastOrders.splice(0, 0, {
            tabId: tab.id,
            tabName: tab.name,
            orderId: orderId
          });
        }, (error) => {
          this.orderError = error;
        });
    }
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
      }, (error) => {
        this.tabsError = error;
      });
  }
}

class LastOrder {
  tabId: string;
  tabName: string;
  orderId: string;
}

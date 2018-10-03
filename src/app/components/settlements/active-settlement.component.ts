import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { finalize } from 'rxjs/operators';
import { Order } from '../../services/model/Order';
import { Router } from '@angular/router';
import { Settlement, TabToOrders } from '../../services/model/Settlement';

@Component({
  selector: 'app-active-settlement',
  templateUrl: './active-settlement.component.html'
})
export class ActiveSettlementComponent implements OnInit {
  loading = false;
  loadingError = '';

  tabs: TabViewModel[] = [];
  allChecked = true;

  confirmSettlement = false;
  filteredTabs: TabViewModel[] = [];
  numOfSelectedTabs = 0;
  submitting = false;
  submitError = '';

  constructor(private service: BackendService, private router: Router) {
  }

  ngOnInit() {
    this.loadEntities();
  }

  allSelected() {
    return this.tabs.reduce((prev, cur) => {
      return prev && cur.selected;
    }, true);
  }

  someSelected() {
    return this.tabs.reduce((prev, cur) => {
      return prev || cur.selected;
    }, false);
  }

  updateAllSelected(isSelected) {
    this.tabs.forEach((tab: TabViewModel) => {
      tab.selected = isSelected;
    });
  }

  sumOfSelectedOutstandings() {
    return this.tabs
      .filter((tab: TabViewModel) => {
        return tab.selected;
      })
      .reduce((prev: number, cur: TabViewModel) => {
        return prev + cur.outstanding;
      }, 0);
  }

  confirmSettleTabs() {
    this.confirmSettlement = true;
    this.submitError = '';

    this.filteredTabs = this.tabs.filter((tab) => {
      return tab.selected;
    });
    this.numOfSelectedTabs = this.filteredTabs.length;
  }

  settleTabs() {
    this.submitting = true;
    this.submitError = '';

    this.service.settleTabs(this.filteredTabs.map((tab: TabViewModel) => {
      return tab.tabId;
    })).pipe(finalize(() => {
      this.submitting = false;
    })).subscribe((settlementId) => {
      this.router.navigate(['settlements', 'old', settlementId]);
    }, (error) => {
      this.submitError = error;
    });
  }

  cancelConfirmation() {
    this.confirmSettlement = false;
  }

  private loadEntities() {
    this.loading = true;
    this.loadingError = '';

    this.service.getActiveSettlement()
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((settlement: Settlement) => {
        settlement.tabToOrders.forEach((tabToOrders: TabToOrders) => {
          this.tabs.push({
            tabId: tabToOrders.tab.id,
            name: tabToOrders.tab.name,
            selected: true,
            outstanding: tabToOrders.orders.reduce((sum: number, order: Order) => {
              return sum + (order.quantity * order.productPrice);
            }, 0)
          });
        });
      }, (error) => {
        this.loadingError = error;
      });
  }
}

class TabViewModel {
  tabId: string;
  name: string;
  selected: boolean;
  outstanding = 0;
}


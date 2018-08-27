import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { finalize } from 'rxjs/operators';
import { Order } from '../../services/model/Order';
import { zip } from 'rxjs';
import { Tab } from '../../services/model/Tab';

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

  constructor(private service: BackendService) {
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

    this.filteredTabs = this.tabs.filter((tab) => {
      return tab.selected;
    });
    this.numOfSelectedTabs = this.filteredTabs.length;
  }

  cancelConfirmation() {
    this.confirmSettlement = false;
  }

  private loadEntities() {
    this.loading = true;
    this.loadingError = '';

    const ordersReq = this.service.getCurrentOrders();
    const tabsReq = this.service.getTabs();

    zip(ordersReq, tabsReq)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((entities) => {
        const orders = entities[0];
        const tabs = entities[1];
        this.applyToViewModel(orders, tabs);
      }, (error) => {
        this.loadingError = error;
      });
  }

  private applyToViewModel(orders: Order[], tabs: Tab[]) {
    const tabIdToViewModel = tabs.reduce((prev, cur) => {
      const viewModel = new TabViewModel();
      viewModel.tabId = cur.id;
      viewModel.name = cur.name;
      viewModel.selected = true;

      prev[cur.id] = viewModel;

      return prev;
    }, {});

    orders.forEach((order: Order) => {
      tabIdToViewModel[order.tabId].outstanding += order.quantity * order.productPrice;
    });

    this.tabs = Object.keys(tabIdToViewModel).map((tabId: string) => {
      return tabIdToViewModel[tabId];
    }).sort((a: TabViewModel, b: TabViewModel) => {
      if (a.name < b.name) {
        return -1;
      }

      return 1;
    }).filter((tab: TabViewModel) => {
      return tab.outstanding > 0;
    });
  }
}

class TabViewModel {
  tabId: string;
  name: string;
  selected: boolean;
  outstanding = 0;
}

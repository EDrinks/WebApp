import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as chart from 'chart.js';
import { BackendService } from '../../services/backend.service';
import { finalize } from 'rxjs/operators';
import { Product } from '../../services/model/Product';
import { PRIMARY_PRODUCT } from '../../constants';
import { Settlement, TabToOrders } from '../../services/model/Settlement';
import { Order } from '../../services/model/Order';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent implements OnInit, OnDestroy {

  @ViewChild('myChart') myChart: ElementRef;

  products: Product[] = [];
  selectedProductId: string = null;
  loadingProducts = false;
  loadingProductsError = '';

  topTenChart = null;
  settlement: Settlement;

  constructor(private service: BackendService) {
  }

  ngOnInit() {
    this.selectedProductId = localStorage.getItem(PRIMARY_PRODUCT);
    this.loadProducts();
    this.loadOrders();

    this.topTenChart = new chart.Chart(this.myChart.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Top 10',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [],
        }]
      },
      options: {
      }
    });
  }

  ngOnDestroy() {
    if (this.topTenChart) {
      this.topTenChart.destroy();
    }
  }

  updateTopTenChart() {
    let tabs = [];
    this.settlement.tabToOrders.forEach((tabToOrders: TabToOrders) => {
      const tabSum = tabToOrders.orders.filter((order: Order) => {
        return order.productId === this.selectedProductId;
      }).reduce((sum: number, order: Order) => {
        return sum + order.quantity;
      }, 0);
      tabs.push([tabToOrders.tab.name, tabSum]);
    });

    tabs = tabs.sort((a, b) => {
      if (a[1] < b[1]) {
        return 1;
      }
      return -1;
    });

    tabs = tabs.slice(0, 10);

    this.topTenChart.data.labels = [];
    this.topTenChart.data.datasets[0].data = [];
    tabs.forEach((tab) => {
      this.topTenChart.data.labels.push(tab[0]);
      this.topTenChart.data.datasets[0].data.push(tab[1]);
    });
    this.topTenChart.update();
  }

  private loadProducts() {
    this.loadingProducts = true;
    this.loadingProductsError = '';

    this.service.getProducts()
      .pipe(finalize(() => {
        this.loadingProducts = false;
      }))
      .subscribe((products: Product[]) => {
        this.products = products;
      }, (error) => {
        this.loadingProductsError = error;
      });
  }

  private loadOrders() {
    this.service.getActiveSettlement()
      .pipe(finalize(() => {
      }))
      .subscribe((settlement: Settlement) => {
        this.settlement = settlement;
        this.updateTopTenChart();
      }, (error) => {
      });
  }
}

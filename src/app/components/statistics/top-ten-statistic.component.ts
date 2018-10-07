import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../services/model/Product';
import { BackendService } from '../../services/backend.service';
import { PRIMARY_PRODUCT } from '../../constants';
import * as chart from 'chart.js';
import { finalize } from 'rxjs/operators';
import { DataPoint } from '../../services/model/DataPoint';

@Component({
  selector: 'app-top-ten-statistic',
  templateUrl: './top-ten-statistic.component.html'
})
export class TopTenStatisticComponent implements OnInit, OnDestroy {

  @ViewChild('myChart') myChart: ElementRef;

  products: Product[] = [];
  selectedProductId: string = null;
  loadingProducts = false;
  loadingProductsError = '';

  topTenChart = null;
  topTenLoading = false;
  topTenError = '';
  topTenCurrent = true;

  constructor(private service: BackendService) {
  }

  ngOnInit() {
    this.selectedProductId = localStorage.getItem(PRIMARY_PRODUCT);
    this.loadProducts();
    this.updateTopTenChart();

    this.topTenChart = new chart.Chart(this.myChart.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: [],
        datasets: [{
          label: 'Top 10',
          backgroundColor: 'rgb(0, 123, 255)',
          borderColor: 'rgb(0, 123, 255)',
          data: [],
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 1
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 1
            }
          }]
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.topTenChart) {
      this.topTenChart.destroy();
    }
  }

  updateTopTenChart() {
    if (this.selectedProductId) {
      this.topTenLoading = true;
      this.topTenError = '';

      this.service.getTopTen(this.selectedProductId, this.topTenCurrent)
        .pipe(finalize(() => {
          this.topTenLoading = false;
        }))
        .subscribe((dataPoints: DataPoint[]) => {
          this.topTenChart.data.labels = [];
          this.topTenChart.data.datasets[0].data = [];
          dataPoints.forEach((dataPoint: DataPoint) => {
            this.topTenChart.data.labels.push(dataPoint.label);
            this.topTenChart.data.datasets[0].data.push(dataPoint.value);
          });
          this.topTenChart.update();
        }, (error) => {
          this.topTenError = error;
        });
    }
  }

  setTopTenCurrent(current: boolean) {
    this.topTenCurrent = current;
    this.updateTopTenChart();
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
}

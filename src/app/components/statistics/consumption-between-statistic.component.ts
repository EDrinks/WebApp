import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as chart from 'chart.js';
import * as moment from 'moment';
import { Product } from '../../services/model/Product';
import { PRIMARY_PRODUCT } from '../../constants';
import { finalize } from 'rxjs/operators';
import { BackendService } from '../../services/backend.service';
import { DataPoint } from '../../services/model/DataPoint';

@Component({
  selector: 'app-consumption-between-statistic',
  templateUrl: './consumption-between-statistic.component.html'
})
export class ConsumptionBetweenStatisticComponent implements OnInit {
  @ViewChild('lineChart') myChart: ElementRef;

  startDate = '';
  endDate = '';
  perDay = true;

  products: Product[] = [];
  selectedProductId: string = null;
  loadingProducts = false;
  loadingProductsError = '';

  loadingChart = false;
  loadingChartError = '';

  private chart: any;

  constructor(private service: BackendService) {
  }

  ngOnInit() {
    this.initChart();
    this.selectedProductId = localStorage.getItem(PRIMARY_PRODUCT);
    this.loadProducts();

    this.startDate = moment().add(-7, 'days').format('YYYY-MM-DD');
    this.endDate = moment().format('YYYY-MM-DD');

    this.loadChartData();
  }

  loadChartData() {
    if (this.startDate && this.endDate) {
      this.loadingChart = true;
      this.loadingChartError = '';
      this.chart.data.labels = [];
      this.chart.data.datasets[0].data = [];

      this.service.getConsumptionBetween(this.selectedProductId, this.startDate, this.endDate, this.perDay)
        .pipe(finalize(() => {
          this.loadingChart = false;
        }))
        .subscribe((dataPoints: DataPoint[]) => {
          dataPoints.forEach((dataPoint: DataPoint) => {
            this.chart.data.labels.push(dataPoint.label);
            this.chart.data.datasets[0].data.push(dataPoint.value);
          });
          this.chart.update();
        }, (error) => {
          this.loadingChartError = error;
        });
    }
  }

  setPerDay(value: boolean) {
    this.perDay = value;
    this.loadChartData();
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

  private initChart() {
    this.chart = new chart.Chart(this.myChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['first', 'second'],
        datasets: [{
          label: 'Top 10',
          backgroundColor: 'rgb(0, 123, 255)',
          borderColor: 'rgb(0, 123, 255)',
          data: [20, 10],
          fill: false
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
}

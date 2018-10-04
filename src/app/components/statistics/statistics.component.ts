import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as chart from 'chart.js';
import { BackendService } from '../../services/backend.service';
import { finalize } from 'rxjs/operators';
import { Product } from '../../services/model/Product';
import { PRIMARY_PRODUCT } from '../../constants';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent implements OnInit {

  @ViewChild('myChart') myChart: ElementRef;

  products: Product[] = [];
  selectedProductId: string = null;
  loadingProducts = false;
  loadingProductsError = '';

  constructor(private service: BackendService) {
  }

  ngOnInit() {
    this.loadProducts();

    const foo = new chart.Chart(this.myChart.nativeElement, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 5, 2, 20, 30, 45],
        }]
      },

      // Configuration options go here
      options: {}
    });
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
        this.selectedProductId = localStorage.getItem(PRIMARY_PRODUCT);
      }, (error) => {
        this.loadingProductsError = error;
      });
  }
}

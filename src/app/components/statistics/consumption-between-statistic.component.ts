import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as chart from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-consumption-between-statistic',
  templateUrl: './consumption-between-statistic.component.html'
})
export class ConsumptionBetweenStatisticComponent implements OnInit {
  @ViewChild('lineChart') myChart: ElementRef;

  startDate = '';
  endDate = '';

  private chart: any;

  ngOnInit() {
    this.initChart();

    this.startDate = moment().add(-7, 'days').format('YYYY-MM-DD');
    this.endDate = moment().format('YYYY-MM-DD');
  }

  private initChart() {
    this.chart = new chart.Chart(this.myChart.nativeElement, {
      type: 'line',
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
              beginAtZero: true,
              stepSize: 1
            }
          }]
        }
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { LoaderService } from '../loading/loader.service';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'output-graph',
  templateUrl: './output-graph.component.html',
  styleUrls: ['./output-graph.component.css']
})
export class OutputGraphComponent implements OnInit {

  // HighCharts Options

  public options: any = {
    chart: {
      type: 'line',
      height: 700
    },
    title: {
      text: 'Line Plot'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      formatter: function () {
        return 'x: ' + this.x +
          ' y: ' + this.y;
      }
    },
    xAxis: {
      type: 'linear',
      labels: {
        formatter: function () {
          return this.value;
        }
      }
    },
    series: [
      {
        name: 'Completed',
        turboThreshold: 500000,
        color: '#00FF00',
        allowPointSelect: true
      },
      {
        name: 'Not Completed',
        turboThreshold: 500000,
        color: '#0000FF',
        allowPointSelect: true
      }
    ],
    line: {
      dataLabels: {
        enabled: true
      }
    }
  }

  subscription: Subscription;

  constructor(private http: HttpClient,
    private loaderService: LoaderService) { }

  ngOnInit() {
    // Show Loader
    this.loaderService.startLoading();

    // Set 10 seconds interval to update data again and again
    const source = interval(10000);

    // Sample API
    // const apiLink = 'https://api.myjson.com/bins/13lnf4';

    // this.subscription = source.subscribe(val => this.getApiResponse(apiLink).then(
    //   data => {
    //     const updated_normal_data = [];
    //     const updated_abnormal_data = [];
    //     data.forEach(row => {
    //       const temp_row = [
    //         new Date(row.timestamp).getTime(),
    //         row.value
    //       ];
    //       row.Normal === 1 ? updated_normal_data.push(temp_row) : updated_abnormal_data.push(temp_row);
    //     });
    //     this.options.series[0]['data'] = updated_normal_data;
    //     this.options.series[1]['data'] = updated_abnormal_data;
    //     Highcharts.chart('container', this.options);
    //   },
    //   error => {
    //     console.log('Something went wrong.');
    //   })
    // );

    const apiLink = 'https://jsonplaceholder.typicode.com/todos';

    this.subscription = source.subscribe(val => this.getApiResponse(apiLink).then(
      data => {
        const completed_data = [];
        const incompleted_data = [];
        data.forEach(row => {
          const temp_row = [
            row.id,
            row.completed === true ? row.userId : -1 
          ];
          row.completed === true ? completed_data.push(temp_row) : incompleted_data.push(temp_row);
        });
        this.options.series[0]['data'] = completed_data;
        this.options.series[1]['data'] = incompleted_data;

        // Hide Loader
        this.loaderService.stopLoading();

        // Render Chart
        Highcharts.chart('container', this.options);
      },
      error => {
        console.log('Something went wrong.');
        // Hide Loader
        this.loaderService.stopLoading();
      })
    );


  }


  getApiResponse(url) {
    return this.http.get<any[]>(url, {})
      .toPromise().then(res => {
        return res;
      });
  }

}

import { Component, OnInit, AfterViewInit } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

import { AppSettings } from "../../../app";
import { LoginService } from "../../../metabol.auth/services";

declare var Plotly: any;


@Component({
  selector: 'app-compare-analysis',
  templateUrl: './compare-analysis.component.html',
  styleUrls: ['./compare-analysis.component.css']
})
export class CompareAnalysisComponent implements OnInit, AfterViewInit {

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private login: LoginService) { }

  options;

  analyses;
  visualization;

  ngOnInit() {
    this.route.params.subscribe((params) => {

      this.options = {  "data" : params }
      this.getAnalysesData(this.options);

    });
  }

  getAnalysesData(options) {
    
    let apiUrl = `${AppSettings.API_ENDPOINT}/analysis/set`;

    this.http.post(apiUrl, options)
      .subscribe((data:any) => this.analyses = data);
  }

  getVisualizationData(options) {
    let apiUrl = `${AppSettings.API_ENDPOINT}/analysis/visualization`;

    this.http.post(apiUrl, options)
      .subscribe((data:any) => {
        data.type = 'heatmap';
        let layout = { 
          margin: { 
            l: 300 
          }, 
          height: 1500,
          xaxis: {
            automargin: true,
          },
          yaxis: {
            automargin: true,
          }, 
        };
        Plotly.plot('heatmap', [data], layout);
      });
  }

  ngAfterViewInit() {
    this.getVisualizationData(this.options);
  }

}

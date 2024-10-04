import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { map } from "rxjs/operators";
import { AppSettings } from "../../../app";
import { LoginService } from "../../../metabol.auth/services";
import * as _ from 'lodash';


@Component({
  selector: 'app-past-analysis',
  templateUrl: './past-analysis.component.html',
  styleUrls: ['./past-analysis.component.css']
})
export class PastAnalysisComponent implements OnInit {
  data = { public: [], list: [], disease: [], results: []};
  form = new FormGroup({});

  temp: any = [];

  loading = true;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private login: LoginService,
    private actRoute: ActivatedRoute,
    private router: Router) {
    }

  ngOnInit() {


    let isActive = localStorage.getItem('access_token') !== null;

    this.actRoute.params.subscribe(params => {
      let searchResults = JSON.parse(localStorage.getItem('search-results'));
      
      if (searchResults) {
        localStorage.removeItem('search-results');
      }


      if (!isActive) {
        ['public'].forEach(x => this.getData(x));

      } else {
        this.getData('list');
        this.getData('public');
      }

    });
  }

  search(query) {
    this.http.get(`${AppSettings.API_ENDPOINT}/analysis/search/${query}`)

      .subscribe((d:any) => {
        this.data.results = d;
        this.createForm();
      });
  }

  getData(type: string) {
    let apiUrl = `${AppSettings.API_ENDPOINT}/analysis/${type}`;
    this.http.get(apiUrl, this.login.optionByAuthorization())

      .subscribe((d:any) => {
        this.data[type] = d;
        
        this.createForm();
        if (type == 'public') {
          this.loading = false;
        }
      });

    

}

  createForm() {
    let combined_data = [];
    for (let t in this.data)

      combined_data = combined_data.concat(this.data[t]);


    this.form = this.fb.group(
      _.zipObject(combined_data.map(x => x["avg_id"]),
      _.times(combined_data.length, _.constant([false]))),

      );

  }

  submit() {
    let selecteds = _.toPairs(this.form.value).filter(x => x[1]).map(x => x[0]);
    this.router.navigate(['panel/compare-analysis', selecteds]);
  }

}

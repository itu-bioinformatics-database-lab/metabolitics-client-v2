import { AppDataLoader } from './../../../metabol.common/services/data-loader/data-loader.service';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConcentrationTableComponent} from '../concentration-table/concentration-table.component';
import {MetaboliteConcentration} from '../../models/metaboliteConcentration';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { utils, write, WorkBook } from 'xlsx';
import * as LZString from 'lz-string';

import {SubsystemAnalyzeService} from '../../services/subsystem-analyze';
import {Router} from '@angular/router';
import {LoginService} from '../../../metabol.auth/services/login';
import {  FileUploader, FileSelectDirective, FileItem, ParsedResponseHeaders } from 'ng2-file-upload/ng2-file-upload';

import { HttpClient } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { HttpClientModule } from '@angular/common/http';


import { AppSettings } from '../../../app/';
import synonyms from '../../../assets/datasets/synonyms_latest.json';
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'app-upload',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.css'],
  providers: [SubsystemAnalyzeService,SimpleNotificationsModule]
})
export class UploadComponent {
  conTable: Array<[string, number, string, string, boolean]> = [];
  file: any;

  analysisTable: Array<[string, number, string, string]> = [];
  public synonymList: [] = synonyms;
  selected = 'Combined.json';
  temp:JSON;
  temp2;
  data;
  ooldM;
  arrayBuffer: any;
  fileToUpload: File = null;
  file3:any;
  file2: File;
  file5: any;


  constructor(fb: FormBuilder,
  private subSerivce: SubsystemAnalyzeService,
  private router: Router,
  private login: LoginService,
  private notify: SimpleNotificationsModule,
  private httpClient: HttpClient,
  private loader: AppDataLoader,
  private notify2: NotificationsService,
) { }

  ngOnInit() {
  }

  jsonChange($event) {
    this.notify2.info('File Upload', 'File uploading');
    this.readJson($event.target);
  }

  readJson(inputValue: any) {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    const file2 = this.selected;
    myReader.readAsText(file);
    myReader.onload = (e: any) => {
    
    this.temp = JSON.parse(e.target.result);
    
    this.loader.get('Recon3D', (recon) => {
      for (let t in this.temp) {
        if (recon.metabolites[t]) {
          this.conTable.push([t, this.temp[t], recon.metabolites[t].id, recon.metabolites[t].name, true]);
        } else {
          if (this.synonymList[t]) {
            const name = this.prioritizeMetabolites(this.synonymList[t]);
            if (recon.metabolites[name]) {
              this.conTable.push([t, this.temp[t], name, recon.metabolites[name].name, true]);
            } else {
              this.conTable.push([t, this.temp[t], name, name, true]);
            }
          } else {
            this.conTable.push([t, this.temp[t], '-', '-', false]);
          }
        }
      }
      });
    }

  }

  csvChange($event) {
    this.notify2.info('File Upload', 'File uploading');
    
    this.readCsv($event.target);
  }

  readCsv(inputValue: any) {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();
    myReader.readAsText(file);
    myReader.onload = (e: any) => {
      const lines = e.target.result.split("\n");
      this.loader.get('Recon3D', (recon) => {
        for (let line of lines){
          const splitted = line.split(',');
          const originalName = splitted[0];
          if (originalName !== '' && originalName !== null) {
            const value = splitted[1];
            if (recon.metabolites[originalName]) {
              this.conTable.push([originalName, value, recon.metabolites[originalName].id, recon.metabolites[originalName].name, true]);
            } else {
              if (this.synonymList[originalName]) {
                const reconName = this.prioritizeMetabolites(this.synonymList[originalName]);
                if (recon.metabolites[reconName]) {
                  this.conTable.push([originalName, value, reconName, recon.metabolites[reconName].name, true]);
                } else {
                  this.conTable.push([originalName, value, reconName, reconName, true]);
                }

              } else {
                this.conTable.push([originalName, value, '-', '-', false]);
              }
            }
          }
        }
        });
    }
  }

  ///////////////////////////////// Workbench
  readText(inputValue: any){
    this.notify2.info('File Upload', 'File uploading',{
      timeOut:5000,
    });
    setTimeout(()=> 
      this.notify2.info('Matching...', 'Performing metabolite matching. This may take a while. Please wait.',{
      timeOut:50000,
    }), 5000);

    this.file3 = inputValue.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(fileReader.result);

      this.httpClient.post(`${AppSettings.API_ENDPOINT}/workbench`, {
        data: fileReader.result
      }).subscribe(data => {
          this.notify2.remove();
          const recData = data as JSON;
          //console.log(data);

          const compressedData = LZString.compress(JSON.stringify(recData));
          //const compressedData = JSON.stringify(recData);
          localStorage.setItem('metabolitics-data', compressedData);
          this.router.navigate(['/analyze/excel-data']);




        },
        err => {
          console.log("Error occured");
        }
      );



    }
    fileReader.readAsText(this.file3);

  }
  //////////////////////////// excel

  incomingfile(event) {
    this.notify2.info('File Upload', 'File uploading',{
      timeOut:5000,
    });
    setTimeout(()=> 
      this.notify2.info('Matching...', 'Performing metabolite matching. This may take a while. Please wait.',{
      timeOut:50000,
    }), 5000);
    this.file5 = event.target.files[0];
    this.onFileChange(this.file5);
  }

  onFileChange(file: any) {
    /* wire up file reader */
    // const target: DataTransfer = <DataTransfer>(evt.target);
    // if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first and second sheet */
      const wsname: string = wb.SheetNames[0];
      const wsname2: string = wb.SheetNames[1];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const ws2: XLSX.WorkSheet = wb.Sheets[wsname2];
      /* save data */
      const data2 = <any> (XLSX.utils.sheet_to_json(ws, {header: 1}));
      const meta = <any> (XLSX.utils.sheet_to_json(ws2, {header: 1}));
    
      this.httpClient.post(`${AppSettings.API_ENDPOINT}/excel`, {
        data: data2, meta: meta
      }).subscribe(data => {
          this.notify2.remove();            //To remove all existing notifications
          const recData = data as JSON;
          const compressedData = LZString.compress(JSON.stringify(recData));
          localStorage.setItem('metabolitics-data',compressedData);
          console.log(recData);
          this.router.navigate(['/analyze/excel-data']);

        },
        err => {
          console.log("Error occured");
        }
      );
      
    };
    reader.readAsBinaryString(this.file5);
  }
  prioritizeMetabolites(metaboliteList) {
    let is_c_found = false;
    let is_m_found = false;
    let recon_name = "";
    metaboliteList.forEach(metabolite => {
      if (/_c/.test(metabolite) && !is_c_found) {
        recon_name = metabolite;
        is_c_found = true;
      }
    });
    if (!is_c_found) {
      metaboliteList.forEach(metabolite => {
        if (/_m/.test(metabolite) && !is_m_found) {
          recon_name = metabolite;
          is_m_found = true;
        }
      });
    }
    if (!is_c_found && !is_m_found) {
      const randomNumber = this.getRandomInt(0, metaboliteList.length - 1);
      recon_name = metaboliteList[randomNumber];
    }
    return recon_name;
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

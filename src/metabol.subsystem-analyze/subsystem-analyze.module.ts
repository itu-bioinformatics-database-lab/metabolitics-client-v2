import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatRippleModule } from '@angular/material';
import { FileSelectDirective } from 'ng2-file-upload';
import { MatFormFieldModule, MatInputModule , MatSelectModule } from '@angular/material';
import {MatTableModule} from '@angular/material/table';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  ConcentrationTableComponent,
  ManualComponent,
  MeasurementComponent,
  UploadComponent,
  SampleComponent,
  ExcelComponent,
  SubsystemAnalyzeComponent
} from './components';

import {  subsystemAnalyzeRouting } from './subsystem-analyze.routes';

import { MetabolCommonModule } from '../metabol.common';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule ,
    MatSelectModule,
    MatRippleModule,
    MatProgressSpinnerModule,

    subsystemAnalyzeRouting,
    MetabolCommonModule
  ],
  declarations: [
    ConcentrationTableComponent,
    ManualComponent,
    MeasurementComponent,
    UploadComponent,
    SampleComponent,
    ExcelComponent,
    SubsystemAnalyzeComponent
  ],
  exports: [

  ]
})
export class SubsystemAnalyzeModule { }

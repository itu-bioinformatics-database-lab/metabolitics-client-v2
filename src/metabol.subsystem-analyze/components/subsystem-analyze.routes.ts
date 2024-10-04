import { SampleComponent } from "./sample/sample.component";
import { Routes } from '@angular/router';

import { AuthGuard } from "../../metabol.auth";

import { ConcentrationTableComponent } from './concentration-table';
import { ManualComponent } from './manual/manual.component';
import { UploadComponent } from './upload/upload.component';
import { SubsystemAnalyzeComponent } from './subsystem-analyze.component';
import { MeasurementComponent } from './measurement/measurement.component';
import {ExcelComponent} from './Excel';
import { from } from 'rxjs';

export const SubsystemAnalyzeRoutes: Routes = [
  {
    path: 'analyze',
    component: SubsystemAnalyzeComponent,
    children: [
      { path: 'manual', component: ManualComponent },
      { path: 'upload', component: UploadComponent },
      { path: 'measurement', component: MeasurementComponent },
      { path: 'sample', component: SampleComponent },
      { path: 'excel-data', component: ExcelComponent },
      { path: '', redirectTo: 'measurement', pathMatch: 'full' }
    ],
    canActivate: [AuthGuard]
  }
];

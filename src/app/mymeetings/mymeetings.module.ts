import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxEchartsModule  } from 'ngx-echarts';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { MymeetingsRoutingModule } from './mymeetings-routing.module';
import { CoreModule } from '../core/core.module';

import { MymeetingsComponent } from './mymeetings.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    NgbModule,
    CoreModule,
    MymeetingsRoutingModule
  ],
  declarations: [
    MymeetingsComponent,
    DashboardComponent
  ]
})
export class MymeetingsModule { }

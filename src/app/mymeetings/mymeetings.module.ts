import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxEchartsModule  } from 'ngx-echarts';

import { MymeetingsRoutingModule } from './mymeetings-routing.module';

import { MymeetingsComponent } from './mymeetings.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule,
    MymeetingsRoutingModule
  ],
  declarations: [
    MymeetingsComponent,
    DashboardComponent
  ]
})
export class MymeetingsModule { }

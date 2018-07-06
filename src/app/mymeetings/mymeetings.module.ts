import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MymeetingsRoutingModule } from './mymeetings-routing.module';

import { MymeetingsComponent } from './mymeetings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home.component';

@NgModule({
  imports: [
    CommonModule,
    MymeetingsRoutingModule
  ],
  declarations: [
    MymeetingsComponent,
    DashboardComponent,
    DashboardHomeComponent
  ]
})
export class MymeetingsModule { }

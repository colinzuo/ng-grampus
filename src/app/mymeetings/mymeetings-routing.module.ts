import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AuthGuardService, DatetimeRangePickerComponent } from '../core';

import { MymeetingsComponent } from './mymeetings.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const mymeetingsRoutes: Routes = [
    {
      path: 'mymeetings',
      component: MymeetingsComponent,
      canActivate: [AuthGuardService],
      children: [
        {
            path: '',
            canActivateChild: [AuthGuardService],
            children: [
                {
                    path: 'dashboard',
                    component: DashboardComponent
                },
                {
                    path: 'datetime-range-picker',
                    component: DatetimeRangePickerComponent
                },
                {
                    path: '',
                    redirectTo: 'dashboard',
                    pathMatch: 'full'
                }
            ]
        }
      ]
    }
  ];

@NgModule({
imports: [
    RouterModule.forChild(mymeetingsRoutes)
],
exports: [
    RouterModule
]
})
export class MymeetingsRoutingModule { }

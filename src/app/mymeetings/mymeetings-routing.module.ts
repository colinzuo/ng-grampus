import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AuthGuardService } from '../core';

import { MymeetingsComponent } from './mymeetings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home.component';

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
                    component: DashboardComponent,
                    children: [
                      {
                        path: '',
                        component: DashboardHomeComponent
                      }
                    ],
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
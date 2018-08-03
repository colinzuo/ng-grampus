import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './not-found.component';
import {LocationComponent} from './location/location.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'location', component: LocationComponent },
  { path: '',   redirectTo: '/mymeetings', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

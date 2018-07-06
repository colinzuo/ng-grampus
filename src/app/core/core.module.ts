import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';

import { ListErrorsComponent } from './list-errors.component';

import {
  ApiService,
  AuthGuardService,
  JwtService,
  UserService
} from './services';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    AuthGuardService,
    JwtService,
    UserService
  ],
  declarations: [
    ListErrorsComponent
  ],
  exports: [
    ListErrorsComponent
  ]
})
export class CoreModule { }


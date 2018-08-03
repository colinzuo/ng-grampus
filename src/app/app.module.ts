import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './not-found.component';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { MymeetingsRoutingModule } from './mymeetings/mymeetings-routing.module';
import { MymeetingsModule } from './mymeetings/mymeetings.module';

import { LoginComponent } from './login/login.component';
import { LocationComponent } from './location/location.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    LocationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    NgbModule.forRoot(),
    MymeetingsRoutingModule,
    MymeetingsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

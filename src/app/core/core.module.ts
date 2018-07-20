import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { ListErrorsComponent } from './list-errors.component';

import {
  ApiService,
  AuthGuardService,
  JwtService,
  UserService
} from './services';
import { TimeRangeService } from './services/time-range.service';
import { DatetimeRangePickerComponent } from './ui/datetime-range-picker/datetime-range-picker.component';
import { KbnTimepickerQuickPanelComponent } from './ui/kbn-timepicker-quick-panel/kbn-timepicker-quick-panel.component';
import { KbnTimepickerRecentPanelComponent } from './ui/kbn-timepicker-recent-panel/kbn-timepicker-recent-panel.component';
import { KbnTimepickerRelativePanelComponent } from './ui/kbn-timepicker-relative-panel/kbn-timepicker-relative-panel.component';
import { KbnTimepickerAbsolutePanelComponent } from './ui/kbn-timepicker-absolute-panel/kbn-timepicker-absolute-panel.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    AuthGuardService,
    JwtService,
    UserService,
    TimeRangeService
  ],
  declarations: [
    ListErrorsComponent,
    DatetimeRangePickerComponent,
    KbnTimepickerQuickPanelComponent,
    KbnTimepickerRecentPanelComponent,
    KbnTimepickerRelativePanelComponent,
    KbnTimepickerAbsolutePanelComponent
  ],
  exports: [
    ListErrorsComponent,
    DatetimeRangePickerComponent
  ]
})
export class CoreModule { }


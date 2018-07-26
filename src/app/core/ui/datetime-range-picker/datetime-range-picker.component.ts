import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

import { dateValidator } from '../../shared';

import { TIME_MODES } from './modes';
import { timeUnits } from './time_units';
import { prettyInterval } from './pretty_interval';
import { REFRESH_INTERVALS } from './refresh_intervals';

import * as moment from 'moment';

@Component({
  selector: 'app-datetime-range-picker',
  templateUrl: './datetime-range-picker.component.html',
  styleUrls: ['./datetime-range-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatetimeRangePickerComponent implements OnInit, OnChanges {
  @Input() inActiveTab;
  @Input() inInterval;

  @Output() timeSelect = new EventEmitter<any>();
  @Output() intervalSelect = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();

  activeTab: any;
  mode: String;
  refreshLists: Array<Array<any>>;
  interval: any;

  relative = {
    from: {
      count: 1,
      unit: 'm',
      preview: undefined,
      round: false
    },
    to: {
      count: 0,
      unit: 's',
      preview: undefined,
      round: false
    }
  };

  absolute: any;

  recent = [];

  constructor(private fb: FormBuilder) {
    this.activeTab = '';
    this.mode = 'quick';
    this.refreshLists = REFRESH_INTERVALS;
    this.interval = this.refreshLists[0][0];
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.activeTab = this.inActiveTab;
    if (!this.absolute) {
      this.absolute = {
        from: moment(),
        to: moment()
      };
    }
    this.interval = this.inInterval;
  }

  setMode(mode: String) {
    this.mode = mode;
  }

  prettyInterval(interval) {
    return prettyInterval(interval.value);
  }

  setRefreshInterval(inter) {
    console.log('setRefreshInterval: ', inter.value);
    this.interval = inter;
    this.intervalSelect.emit(inter);
  }

  onClose() {
    console.log('onClose()');
    this.close.emit({});
  }

  onApply(event) {
    console.log('onApply ', event);
    this.recent.unshift(event);
    for (let i = 1; i < this.recent.length;) {
      if (this.recent[i].display === event.display) {
        this.recent.splice(i, 1);
      } else {
        i++;
      }
    }
    if (this.recent.length > 10) {
      this.recent.splice(10, this.recent.length - 10);
    }
    this.timeSelect.emit(event);

    if (event.mode === TIME_MODES.ABSOLUTE) {
      this.absolute = event;
    } else if (event.mode === TIME_MODES.RELATIVE) {
      this.relative = event;
    }
  }

}

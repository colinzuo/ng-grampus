import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, OnChanges} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import { dateValidator } from '../../shared';
import * as moment from 'moment';
import _ from 'lodash';
import { TIME_MODES } from '../datetime-range-picker/modes';

@Component({
  selector: 'app-kbn-timepicker-absolute-panel',
  templateUrl: './kbn-timepicker-absolute-panel.component.html',
  styleUrls: ['../datetime-range-picker/datetime-range-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbDatepickerConfig]
})
export class KbnTimepickerAbsolutePanelComponent implements OnInit, OnChanges {
  @Input() inAbsolute;
  @Output() outAbsolute = new EventEmitter<any>();

  absolute: any = {};

  absoluteForm: FormGroup;

  format = 'YYYY-MM-DD HH:mm:ss.SSS';
  navFromFormat = 'YYYY-MM-DD 00:00:00.000';
  navToFormat = 'YYYY-MM-DD 23:59:59.999';

  constructor(private fb: FormBuilder,
              config: NgbDatepickerConfig) {
    // customize default values of datepickers used by this component tree
    config.minDate = {year: 1900, month: 1, day: 1};
    config.maxDate = {year: 2099, month: 12, day: 31};

    // days that don't belong to current month are not visible
    config.outsideDays = 'hidden';

    const datePattern = '(?:\\d\\d){1,2}-(?:0?[1-9]|1[0-2])-(?:(?:0[1-9])|(?:[12][0-9])|(?:3[01])|[1-9])[T ]' +
      '(?:2[0123]|[01]?[0-9]):?(?:[0-5][0-9])(?::?(?:(?:[0-5]?[0-9]|60)(?:[:.,][0-9]+)?))';

    this.absoluteForm = this.fb.group({
      'from': ['', Validators.compose([Validators.required, Validators.pattern(datePattern), dateValidator()])],
      'fromPicker': [''],
      'to': ['', Validators.compose([Validators.required, Validators.pattern(datePattern), dateValidator()])],
      'toPicker': ['']
    });
  }

  ngOnInit() {
  }

  rebuildForm() {
    this.absoluteForm.reset({
      from: this.absolute.from.format(this.format),
      to: this.absolute.to.format(this.format)
    });
    this.absolute.display = this.absolute.from.format(this.format) + ' to ' + this.absolute.to.format(this.format);
  }

  ngOnChanges() {
    this.absolute = _.cloneDeep(this.inAbsolute);
    console.log('ngOnChanges ', this.absolute);
    this.rebuildForm();
  }

  navigateFromDateTo(event: NgbDateStruct) {
    console.log('navigateFromDateTo: ', event);
    const navDisplay = moment().set({'year': event.year, 'month': event.month - 1, 'date': event.day}).format(this.navFromFormat);
    this.absoluteForm.get('from').setValue(navDisplay);
  }

  navigateToDateTo(event: NgbDateStruct) {
    console.log('navigateToDateTo: ', event);
    const navDisplay = moment().set({'year': event.year, 'month': event.month - 1, 'date': event.day}).format(this.navToFormat);
    this.absoluteForm.get('to').setValue(navDisplay);
  }

  setToNow(param) {
    const timeDisplay = moment().format(this.format);
    this.absoluteForm.get(param.key).setValue(timeDisplay);
  }

  applyAbsolute() {
    this.absolute.mode = TIME_MODES.ABSOLUTE;
    console.log('applyAbsolute: ', this.absolute);
    this.outAbsolute.emit(this.absolute);
  }

  checkAbsolute() {
    if (this.from.invalid || this.to.invalid || this.absolute.from > this.absolute.to || !this.absolute.from || !this.absolute.to) {
      return true;
    }
    return false;
  }

  updateAbsolute(param) {
    const key = param.key;
    if (key === 'from') {
      this.absolute.from = moment(this.absoluteForm.get('from').value);
      const fromPickerValue = this.absoluteForm.get('fromPicker').value;
      if (!this.absolute.from) {
        this.absoluteForm.get('fromPicker').setValue(undefined);
      } else if (!fromPickerValue || fromPickerValue.year !== this.absolute.from.year() ||
        fromPickerValue.month !== (this.absolute.from.month() + 1) ||
        fromPickerValue.day !== this.absolute.from.date()) {
        this.absoluteForm.get('fromPicker').setValue({
          year: this.absolute.from.year(),
          month: this.absolute.from.month() + 1,
          day: this.absolute.from.date()
        });
      }
    } else if (key === 'to') {
      this.absolute.to = moment(this.absoluteForm.get('to').value);
      const toPickerValue = this.absoluteForm.get('toPicker').value;
      if (!this.absolute.to) {
        this.absoluteForm.get('toPicker').setValue(undefined);
      } else if (!toPickerValue || toPickerValue.year !== this.absolute.to.year() ||
        toPickerValue.month !== (this.absolute.to.month() + 1) ||
        toPickerValue.day !== this.absolute.to.date()) {
        this.absoluteForm.get('toPicker').setValue({
          year: this.absolute.to.year(),
          month: this.absolute.to.month() + 1,
          day: this.absolute.to.date()
        });
      }
    }
    this.absolute.display = this.absolute.from.format(this.format) + ' to ' + this.absolute.to.format(this.format);
  }

  get from() { return this.absoluteForm.get('from'); }
  get to() { return this.absoluteForm.get('to'); }
}

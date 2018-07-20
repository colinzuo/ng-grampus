import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, OnChanges} from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import dateMath from '../datetime-range-picker/datemath';
import { timeUnits } from '../datetime-range-picker/time_units';
import { relativeOptions } from '../datetime-range-picker/relative_options';
import _ from 'lodash';
import { TIME_MODES } from '../datetime-range-picker/modes';

@Component({
  selector: 'app-kbn-timepicker-relative-panel',
  templateUrl: './kbn-timepicker-relative-panel.component.html',
  styleUrls: ['../datetime-range-picker/datetime-range-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KbnTimepickerRelativePanelComponent implements OnInit, OnChanges {
  @Input() inRelative;
  @Output() outRelative = new EventEmitter<any>();

  relative: any;

  relativeForm: FormGroup;

  format = 'MMMM Do YYYY, HH:mm:ss.SSS';
  units = timeUnits;
  relativeOptions = relativeOptions;

  constructor(private fb: FormBuilder) {
    this.relativeForm = this.fb.group({
      'from': this.fb.group({
        'count': ['', Validators.required],
        'unit': ['', Validators.required],
        'round': ['', Validators.required],
        'preview': ['']
      }),
      'to': this.fb.group({
        'count': ['', Validators.required],
        'unit': ['', Validators.required],
        'round': ['', Validators.required],
        'preview': ['']
      })
    });
  }

  ngOnInit() {
  }

  rebuildForm() {
    this.relativeForm.reset({
      from: this.relative.from,
      to: this.relative.to
    });
    this.formatRelative('from');
    this.formatRelative('to');
    this.relative.display = this.getRelativeString('from') + ' to ' + this.getRelativeString('to');
  }

  ngOnChanges() {
    this.relative = _.cloneDeep(this.inRelative);
    console.log('ngOnChanges ', this.relative);
    this.rebuildForm();
  }

  applyRelative() {
    this.relative.mode = TIME_MODES.RELATIVE;
    console.log('applyRelative: ', this.relative);
    this.outRelative.emit(this.relative);
  }

  updateRelative(param) {
    const key = param.key;
    if (key === 'from') {
      this.relative.from.count = this.relativeForm.get(key).get('count').value;
      this.relative.from.unit = this.relativeForm.get(key).get('unit').value;
      this.relative.from.round = this.relativeForm.get(key).get('round').value;
    } else {
      this.relative.to.count = this.relativeForm.get(key).get('count').value;
      this.relative.to.unit = this.relativeForm.get(key).get('unit').value;
      this.relative.to.round = this.relativeForm.get(key).get('round').value;
    }
    this.formatRelative(key);
    this.relative.display = this.getRelativeString('from') + ' to ' + this.getRelativeString('to');
  }

  setRelativeToNow(param) {
    const key = param.key;
    if (key === 'from') {
      this.relativeForm.get(key).get('count').setValue(0);
      this.relativeForm.get(key).get('round').setValue(false);
    } else {
      this.relativeForm.get(key).get('count').setValue(0);
      this.relativeForm.get(key).get('round').setValue(false);
    }
  }

  getRelativeString(key) {
    let count = 0;
    let round = false;
    let matches = 's';

    if (key === 'from') {
      count = this.relative.from.count;
      round = this.relative.from.round;
      matches = this.relative.from.unit.match(/([smhdwMy])(\+)?/);
    } else {
      count = this.relative.to.count;
      round = this.relative.to.round;
      matches = this.relative.to.unit.match(/([smhdwMy])(\+)?/);
    }
    let unit;
    let operator = '-';
    if (matches && matches[1]) { unit = matches[1]; }
    if (matches && matches[2]) { operator = matches[2]; }
    if (count === 0 && !round) { return 'now'; }
    let result = `now${operator}${count}${unit}`;
    result += (round ? '/' + unit : '');
    return result;
  }

  formatRelative(key) {
    const relativeString = this.getRelativeString(key);
    const parsed = dateMath.parse(relativeString, { roundUp: key === 'to' });
    let preview;
    if (relativeString === 'now') {
      preview = 'Now';
    } else {
      preview = parsed ? parsed.format(this.format) : undefined;
    }
    if (key === 'from') {
      this.relative.from.preview = preview;
    } else {
      this.relative.to.preview = preview;
    }
    return parsed;
  }

  checkRelative () {
    if (this.relative.from.count != null && this.relative.to.count != null) {
      const from = dateMath.parse(this.getRelativeString('from'));
      const to = dateMath.parse(this.getRelativeString('to'), { roundUp: true });
      if (to && from) { return to.isBefore(from); }
      return true;
    }
  }
}

import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';

import { QUICK_RANGES } from '../datetime-range-picker/quick_ranges';
import { TIME_MODES } from '../datetime-range-picker/modes';

import _ from 'lodash';

@Component({
  selector: 'app-kbn-timepicker-quick-panel',
  templateUrl: './kbn-timepicker-quick-panel.component.html',
  styleUrls: ['../datetime-range-picker/datetime-range-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KbnTimepickerQuickPanelComponent implements OnInit {
  @Output() outQuick = new EventEmitter<any>();

  quickLists: Array<Array<any>>;
  selectedQuick: any;

  constructor() {
    this.quickLists = _.cloneDeep(QUICK_RANGES);
  }

  ngOnInit() {
  }

  applyQuick(selectedQuick) {
    this.selectedQuick = selectedQuick;
    this.selectedQuick.mode = TIME_MODES.QUICK;
    console.log('applyQuick: ', this.selectedQuick);
    this.outQuick.emit(this.selectedQuick);
  }

}

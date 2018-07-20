import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, OnChanges} from '@angular/core';

import _ from 'lodash';
import TIME_MODES from '../datetime-range-picker/modes';

@Component({
  selector: 'app-kbn-timepicker-recent-panel',
  templateUrl: './kbn-timepicker-recent-panel.component.html',
  styleUrls: ['../datetime-range-picker/datetime-range-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KbnTimepickerRecentPanelComponent implements OnInit, OnChanges {
  @Input() inRecent;
  @Output() outRecent = new EventEmitter<any>();

  recent;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.recent = _.cloneDeep(this.inRecent);
    console.log('ngOnChanges ', this.recent);
  }

  applyRecent(data) {
    console.log('applyRecent: ', data);
    this.outRecent.emit(data);
  }
}

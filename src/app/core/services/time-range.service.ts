import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';

import {TimeRange, RefreshSetting} from '../models';
import {distinctUntilChanged} from 'rxjs/operators';
import * as moment from 'moment';
import _ from 'lodash';

import dateMath from '../ui/datetime-range-picker/datemath';

@Injectable({
  providedIn: 'root'
})
export class TimeRangeService {
  private currentTimeRangeSubject;
  public currentTimeRange;
  localTimeRange: TimeRange;

  private currentRefreshSettingSubject: any;
  public currentRefreshSetting;

  refreshTimerId: any;
  refreshSetting: RefreshSetting;

  timeRange: TimeRange;

  constructor() {
    this.refreshSetting = {enabled: true, interval: 0};
    this.currentRefreshSettingSubject = new BehaviorSubject<RefreshSetting>(this.refreshSetting);
    this.currentRefreshSetting = this.currentRefreshSettingSubject.asObservable().pipe(distinctUntilChanged());

    this.timeRange = new TimeRange();
    this.timeRange.mode = 'quick';
    this.timeRange.from = 'now/M';
    this.timeRange.to = 'now/M';
    this.timeRange.unit = 'M';
    this.timeRange.display = 'This Month';
    this.processTimeRange(this.timeRange);

    this.currentTimeRangeSubject = new BehaviorSubject<TimeRange>(this.timeRange);
    this.currentTimeRange = this.currentTimeRangeSubject.asObservable().pipe(distinctUntilChanged());
  }

  processTimeRange(timeRange: TimeRange) {
    let from;
    let to;

    if (timeRange.mode === 'quick') {
      from = dateMath.parse(timeRange.from);
      to = dateMath.parse(timeRange.to, {roundUp: true});
    } else if (timeRange.mode === 'relative') {
      const fromStr = this.getRelativeString(timeRange, 'from');
      const toStr = this.getRelativeString(timeRange, 'to');
      from = dateMath.parse(fromStr);
      to = dateMath.parse(toStr, {roundUp: true});
    } else if (timeRange.mode === 'absolute') {
      from = timeRange.from;
      to = timeRange.to;
    }
    console.log('processTimeRange: from ', from);
    console.log('processTimeRange: to ', to);
    timeRange.fromMoment = from;
    timeRange.toMoment = to;
  }

  setTimeRange(timeRange: TimeRange) {
    this.processTimeRange(timeRange);
    this.timeRange = _.clone(timeRange);
    this.currentTimeRangeSubject.next(this.timeRange);
  }

  setRefreshInterval(refreshInterval: number) {
    if (refreshInterval !== 0 && refreshInterval < 5000) {
      console.log('setRefreshInterval: invalid interval ', refreshInterval);
      return;
    }
    if (this.refreshTimerId) {
      clearInterval(this.refreshTimerId);
      this.refreshTimerId = undefined;
    }
    this.refreshSetting.interval = refreshInterval;
    this.refreshSetting = _.clone(this.refreshSetting);
    console.log('setRefreshInterval: ', this.refreshSetting);
    if (this.refreshSetting.enabled && this.refreshSetting.interval > 0) {
      this.refreshTimerId = setInterval(() => this.refreshTimeRange(), this.refreshSetting.interval);
    }
    this.currentRefreshSettingSubject.next(this.refreshSetting);
  }

  setRefreshEnabled(enabled: boolean) {
    if (this.refreshSetting.enabled === enabled) {
      return;
    }
    this.refreshSetting.enabled = enabled;
    this.refreshSetting = _.clone(this.refreshSetting);
    console.log('setRefreshEnabled: ', this.refreshSetting);
    if (!this.refreshSetting.enabled) {
      if (this.refreshTimerId) {
        clearInterval(this.refreshTimerId);
        this.refreshTimerId = undefined;
      }
    } else if (this.refreshSetting.interval > 0) {
      this.refreshTimerId = setInterval(() => this.refreshTimeRange(), this.refreshSetting.interval);
    }
    this.currentRefreshSettingSubject.next(this.refreshSetting);
  }

  refreshTimeRange() {
    console.log('refreshTimeRange: ', moment().toISOString(true));
    this.processTimeRange(this.timeRange);
    this.timeRange = _.clone(this.timeRange);
    this.currentTimeRangeSubject.next(this.timeRange);
  }

  getRelativeString(timeRange: TimeRange, key) {
    const relative = timeRange;

    let count = 0;
    let round = false;
    let matches = 's';

    if (key === 'from') {
      count = relative.from.count;
      round = relative.from.round;
      matches = relative.from.unit.match(/([smhdwMy])(\+)?/);
    } else {
      count = relative.to.count;
      round = relative.to.round;
      matches = relative.to.unit.match(/([smhdwMy])(\+)?/);
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

  moveTimeBack() {
    if (this.timeRange.mode === 'quick' || this.timeRange.mode === 'relative') {
      this.timeRange.from = this.timeRange.fromMoment;
      this.timeRange.to = this.timeRange.toMoment;
      this.timeRange.mode = 'absolute';
    }
    if (this.timeRange.unit) {
      this.timeRange.from.subtract(1, this.timeRange.unit);
      this.timeRange.to.subtract(1, this.timeRange.unit);
    } else {
      const diff = this.timeRange.to.diff(this.timeRange.from);
      this.timeRange.from.subtract(diff + 1, 'ms');
      this.timeRange.to.subtract(diff + 1, 'ms');
    }
    const timeFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
    this.timeRange.display = this.timeRange.from.format(timeFormat) + ' - ' + this.timeRange.to.format(timeFormat);
    this.timeRange = _.clone(this.timeRange);
    this.currentTimeRangeSubject.next(this.timeRange);
  }

  moveTimeForward() {
    if (this.timeRange.mode === 'quick' || this.timeRange.mode === 'relative') {
      this.timeRange.from = this.timeRange.fromMoment;
      this.timeRange.to = this.timeRange.toMoment;
      this.timeRange.mode = 'absolute';
    }
    if (this.timeRange.unit) {
      this.timeRange.from.add(1, this.timeRange.unit);
      this.timeRange.to.add(1, this.timeRange.unit);
    } else {
      const diff = this.timeRange.to.diff(this.timeRange.from);
      this.timeRange.from.add(diff + 1, 'ms');
      this.timeRange.to.add(diff + 1, 'ms');
    }
    const timeFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
    this.timeRange.display = this.timeRange.from.format(timeFormat) + ' - ' + this.timeRange.to.format(timeFormat);
    this.timeRange = _.clone(this.timeRange);
    this.currentTimeRangeSubject.next(this.timeRange);
  }
}

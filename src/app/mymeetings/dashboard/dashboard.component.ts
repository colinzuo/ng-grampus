import {Component, HostBinding, OnInit, HostListener, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

import { NgxEchartsService } from 'ngx-echarts';

import {UserService, ApiService, RefreshSetting, TimeRange} from '../../core';
import { TimeRangeService } from '../../core/services/time-range.service';
import { prettyInterval } from '../../core/ui/datetime-range-picker/pretty_interval';
import { UI_CONFIG } from '../../config';

import { slideInDownAnimation } from '../../animations';

import { AggDatehistgramReq } from './agg-datehistgram-req';
import { AggDatehistgramRsp } from './agg-datehistgram-rsp';
import { DateRange } from './date-range';
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [slideInDownAnimation]
})
export class DashboardComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;

  screenHeight: number;
  screenWidth: number;
  mainBodyWidth: number;

  // dateRanges: DateRange[];
  // selectedDateRange: DateRange;

  confGeneralChartEchartsIntance: any;
  callGeneralChartEchartsIntance: any;

  confChartOption: any;
  aggDatehistogramConf: AggDatehistgramReq;
  confTotalCount: number;
  confTotalDurationSum: number;

  callChartOption: any;
  aggDatehistogramCall: AggDatehistgramReq;
  callTotalCount: number;
  callTotalDurationSum: number;

  startTime: String;
  endTime: String;

  startTimeDisplay: String;
  endTimeDisplay: String;

  ongoingConfGeneralApiCnt = 0;
  ongoingConfGeneralApiTimerId: any;

  ongoingCallGeneralApiCnt = 0;
  ongoingCallGeneralApiTimerId: any;

  refreshSetting: RefreshSetting;
  timeRange: TimeRange;
  activeTab: string;

  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      console.log('DashboardComponent screenWidth ', this.screenWidth);
      console.log('DashboardComponent screenHeight ', this.screenHeight);

      this.mainBodyWidth = this.screenWidth - UI_CONFIG.NAV_PANEL_WIDTH
        - UI_CONFIG.RESERVE_WIDTH;
      if (this.mainBodyWidth < 500) {
        this.mainBodyWidth = 500;
      }
      console.log('DashboardComponent mainBodyWidth ', this.mainBodyWidth);

      this.chartResize();
  }

  chartResize() {
    if (this.confGeneralChartEchartsIntance) {
      this.confGeneralChartEchartsIntance.resize();
    }

    if (this.callGeneralChartEchartsIntance) {
      this.callGeneralChartEchartsIntance.resize();
    }
  }

  constructor(private userService: UserService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private es: NgxEchartsService,
    private timeRangeService: TimeRangeService) {
    }

  ngOnInit() {
    this.refreshSetting = new RefreshSetting();
    this.timeRangeService.currentRefreshSetting.subscribe((refreshSetting) => {
      this.onUpdateRefreshSetting(refreshSetting);
    });
    this.timeRange = new TimeRange();
    this.timeRangeService.currentTimeRange.subscribe((timeRange) => {
      this.onUpdateTimeRange(timeRange);
    });
    this.onResize();
    this.confTotalCount = 0;
    this.confTotalDurationSum = 0;
    this.setConfCallGeneralChart('conf', [], [], []);

    this.callTotalCount = 0;
    this.callTotalDurationSum = 0;
    this.setConfCallGeneralChart('call', [], [], []);
  }

  onConfGeneralChartInit(ec) {
    this.confGeneralChartEchartsIntance = ec;
  }

  onCallGeneralChartInit(ec) {
    this.callGeneralChartEchartsIntance = ec;
  }

  setConfCallGeneralChart(target: string, xData: any, yDataCount: any, yDataDurationSum: any) {
    const echarts = this.es.echarts;

    this.chartResize();

    let seriesName;
    let titleText;
    if (target === 'conf') {
      if (this.confGeneralChartEchartsIntance) {
        this.confGeneralChartEchartsIntance.hideLoading();
      }
      seriesName = ['会议数量', '会议时长'];
      titleText = '会议数量时长图';
    } else if (target === 'call') {
      if (this.callGeneralChartEchartsIntance) {
        this.callGeneralChartEchartsIntance.hideLoading();
      }
      seriesName = ['呼叫数量', '呼叫时长'];
      titleText = '呼叫数量时长图';
    } else {
      return;
    }

    const chartOption = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            },
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            formatter: function (params) {
                return params[0].name + '<br><br>' +
                    params[0].seriesName + ':  ' + params[0].value + '<br>' +
                    params[1].seriesName + ':  ' + params[1].value;
            }
        },
        axisPointer: {
            link: {xAxisIndex: 'all'}
        },
        legend: {
            data: seriesName,
            x: 'left'
        },
        title: [{
            left: 'center',
            text: titleText
        }],
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        grid: [{
            left: 50,
            right: 50,
            height: '35%',
            containLabel: true
        }, {
            left: 50,
            right: 50,
            height: '35%',
            top: '55%',
            containLabel: true
        }],
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: xData
            },
            {
                gridIndex: 1,
                type: 'category',
                boundaryGap: true,
                data: xData
            }
        ],
        yAxis: [
            {
                type: 'value',
                name : '数量(个)',
                splitLine: { show: false }
            },
            {
                gridIndex: 1,
                name : '时长(小时)',
                type: 'value',
                splitLine: { show: false }
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                realtime: true,
                start: 0,
                end: 100,
                xAxisIndex: [0, 1]
            },
            {
                show: true,
                realtime: true,
                start: 0,
                end: 100,
                xAxisIndex: [0, 1],
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.' +
                      '9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6' +
                      'V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }
        ],
        series: [
            {
                type: 'line',
                name: seriesName[0],
                data: yDataCount,
                smooth: true,
                symbol: 'circle',
                symbolSize: 10,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(255, 70, 131)',
                        borderWidth: 1,
                        borderColor: 'white'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    }
                },
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                type: 'line',
                name: seriesName[1],
                data: yDataDurationSum,
                smooth: true,
                symbol: 'circle',
                symbolSize: 10,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(55, 70, 131)',
                        borderWidth: 1,
                        borderColor: 'white'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    }
                },
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                },
                xAxisIndex: 1,
                yAxisIndex: 1
            }
        ]
    };

    if (target === 'conf') {
      this.confChartOption = chartOption;
    } else if (target === 'call') {
      this.callChartOption = chartOption;
    }
  }

  requestConfGeneralChartData() {
    if (this.confGeneralChartEchartsIntance) {
        this.confGeneralChartEchartsIntance.showLoading();
    }
    const curUser = this.userService.getCurrentUser();
    const aggDatehistogramConf: AggDatehistgramReq = new AggDatehistgramReq();
    aggDatehistogramConf.company_id = curUser.profile.orgId;
    aggDatehistogramConf.start_time = this.startTime;
    aggDatehistogramConf.end_time = this.endTime;
    aggDatehistogramConf.interval = '1d';
    aggDatehistogramConf.time_zone = '+08:00';
    aggDatehistogramConf.format = 'yyyy-MM-dd';
    aggDatehistogramConf.target = 'conf';
    this.aggDatehistogramConf = aggDatehistogramConf;
    if (this.ongoingConfGeneralApiTimerId) {
      clearTimeout(this.ongoingConfGeneralApiTimerId);
    }
    this.ongoingConfGeneralApiTimerId = setTimeout(() => {
      if (this.ongoingConfGeneralApiCnt !== 0) {
        console.log('unexpected ongoingConfGeneralApiCnt, ', this.ongoingConfGeneralApiCnt);
        this.ongoingConfGeneralApiCnt = 0;
      }
      this.ongoingConfGeneralApiTimerId = undefined;
    }, 20000);
    this.ongoingConfGeneralApiCnt++;
    this.apiService.post('/report/agg/datehistgram_stats', aggDatehistogramConf).subscribe(
        data => {
            console.log('DashboardComponent aggDatehistogramConf: rsp ', data);
            this.updateConfGeneralChart(data);
          this.ongoingConfGeneralApiCnt--;
        },
        err => {
          console.log('DashboardComponent aggDatehistogramConf: err ', err);
          this.ongoingConfGeneralApiCnt--;
        }
    );
  }

  updateConfGeneralChart(data: AggDatehistgramRsp) {
    const xData = new Array();
    const yDataCount = new Array();
    const yDataDurationSum = new Array();
    this.confTotalCount = 0;
    this.confTotalDurationSum = 0;

    for (let idx = 0; idx < data.buckets.length; idx++) {
        xData[idx] = data.buckets[idx].key_as_string;
        yDataCount[idx] = data.buckets[idx].count;
        yDataDurationSum[idx] = Math.round(data.buckets[idx].sum.valueOf() / 36) / 100;

        this.confTotalCount += yDataCount[idx];
        this.confTotalDurationSum += yDataDurationSum[idx];
    }
    this.confTotalDurationSum = Math.round(this.confTotalDurationSum * 100) / 100;
    this.setConfCallGeneralChart('conf', xData, yDataCount, yDataDurationSum);
  }

  requestCallGeneralChartData() {
    if (this.callGeneralChartEchartsIntance) {
        this.callGeneralChartEchartsIntance.showLoading();
    }
    const curUser = this.userService.getCurrentUser();
    const aggDatehistogramCall: AggDatehistgramReq = new AggDatehistgramReq();
    aggDatehistogramCall.company_id = curUser.profile.orgId;
    aggDatehistogramCall.start_time = this.startTime;
    aggDatehistogramCall.end_time = this.endTime;
    aggDatehistogramCall.interval = '1d';
    aggDatehistogramCall.time_zone = '+08:00';
    aggDatehistogramCall.format = 'yyyy-MM-dd';
    aggDatehistogramCall.target = 'call';
    this.aggDatehistogramCall = aggDatehistogramCall;

    if (this.ongoingCallGeneralApiTimerId) {
      clearTimeout(this.ongoingCallGeneralApiTimerId);
    }
    this.ongoingCallGeneralApiTimerId = setTimeout(() => {
      if (this.ongoingCallGeneralApiCnt !== 0) {
        console.log('unexpected ongoingCallGeneralApiCnt, ', this.ongoingCallGeneralApiCnt);
        this.ongoingCallGeneralApiCnt = 0;
      }
      this.ongoingCallGeneralApiTimerId = undefined;
    }, 20000);
    this.ongoingCallGeneralApiCnt++;

    this.apiService.post('/report/agg/datehistgram_stats', aggDatehistogramCall).subscribe(
        data => {
            console.log('DashboardComponent aggDatehistogramCall: rsp ', data);
            this.updateCallGeneralChart(data);
          this.ongoingCallGeneralApiCnt--;
        },
        err => {
          console.log('DashboardComponent aggDatehistogramCall: err ', err);
          this.ongoingCallGeneralApiCnt--;
        }
    );
  }

  updateCallGeneralChart(data: AggDatehistgramRsp) {
    const xData = new Array();
    const yDataCount = new Array();
    const yDataDurationSum = new Array();
    this.callTotalCount = 0;
    this.callTotalDurationSum = 0;

    for (let idx = 0; idx < data.buckets.length; idx++) {
        xData[idx] = data.buckets[idx].key_as_string;
        yDataCount[idx] = data.buckets[idx].count;
        yDataDurationSum[idx] = Math.round(data.buckets[idx].sum.valueOf() / 36) / 100;

        this.callTotalCount += yDataCount[idx];
        this.callTotalDurationSum += yDataDurationSum[idx];
    }
    this.callTotalDurationSum = Math.round(this.callTotalDurationSum * 100) / 100;
    this.setConfCallGeneralChart('call', xData, yDataCount, yDataDurationSum);
  }

  onUpdateRefreshSetting(refreshSetting: RefreshSetting) {
    console.log('onUpdateRefreshSetting: ', refreshSetting);
    this.refreshSetting = refreshSetting;
  }

  get refreshInterval() {
    if (!this.refreshSetting) {
      return 0;
    } else {
      return this.refreshSetting.interval;
    }
  }

  get refreshEnabled() {
    if (!this.refreshSetting) {
      return false;
    } else {
      return this.refreshSetting.enabled;
    }
  }

  toggleRefresh() {
    if (this.refreshSetting) {
      this.timeRangeService.setRefreshEnabled(!this.refreshSetting.enabled);
    }
  }

  toggleInterval() {
    if (this.activeTab === 'interval') {
      this.activeTab = '';
    } else {
      this.activeTab = 'interval';
    }
  }

  onIntervalSelect(interval) {
    if (interval.value !== this.refreshSetting.interval) {
      this.refreshSetting.interval = interval.value;
      this.timeRangeService.setRefreshInterval(this.refreshSetting.interval);
    }

    this.activeTab = '';
  }

  prettyInterval() {
    const display = prettyInterval(this.refreshInterval);
    return display;
  }

  toggleFilter() {
    if (this.activeTab === 'filter') {
      this.activeTab = '';
    } else {
      this.activeTab = 'filter';
    }
  }

  onTimeSelect(timeRange: TimeRange) {
    console.log('onTimeSelect: ', timeRange);
    this.timeRangeService.setTimeRange(timeRange);
    this.activeTab = '';
  }

  onUpdateTimeRange(timeRange: TimeRange) {
    console.log('onUpdateTimeRange: ', timeRange);
    this.timeRange = timeRange;
    const timeFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
    const timeFormatDisplay = 'YYYY-MM-DD HH:mm:ss';
    this.startTime = this.timeRange.fromMoment.format(timeFormat);
    this.startTimeDisplay = this.timeRange.fromMoment.format(timeFormatDisplay);
    this.endTime = this.timeRange.toMoment.format(timeFormat);
    this.endTimeDisplay = this.timeRange.toMoment.format(timeFormatDisplay);

    this.requestConfGeneralChartData();
    this.requestCallGeneralChartData();
  }

  get timeRangeDisplay() {
    if (!this.timeRange || !this.timeRange.display || this.timeRange.display === '') {
      return 'Invalid Time Range';
    }
    return this.timeRange.display;
  }

  moveTimeBack() {
    this.timeRangeService.moveTimeBack();
  }

  moveTimeForward() {
    this.timeRangeService.moveTimeForward();
  }

  isCurrent(tabName) {
    if (this.activeTab === tabName) {
      return true;
    }
    return false;
  }

  get isLoading() {
    if (this.ongoingConfGeneralApiCnt > 0) {
      return true;
    }
    if (this.ongoingCallGeneralApiCnt > 0) {
      return true;
    }
    return false;
  }

  //
  // initDateRanges() {
  //   this.dateRanges = [
  //     {
  //       name: '本月',
  //       type: 'CurMonth'
  //     },
  //     {
  //       name: '上一个月',
  //       type: 'PrevMonth'
  //     },
  //     {
  //       name: '上一个季度',
  //       type: 'PrevQuarter'
  //     },
  //     {
  //       name: '今年',
  //       type: 'CurYear'
  //     },
  //     {
  //       name: '去年',
  //       type: 'PrevYear'
  //     }
  //   ];
  //   this.selectDateRange(this.dateRanges[0]);
  // }
  //
  // selectDateRangeReal() {
  //   this.setupTime(this.selectedDateRange.type);
  //   console.log('selectDateRange ', this.selectedDateRange);
  //
  //   this.confTotalCount = 0;
  //   this.confTotalDurationSum = 0;
  //   this.setConfCallGeneralChart('conf', [], [], []);
  //   this.requestConfGeneralChartData();
  //
  //   this.callTotalCount = 0;
  //   this.callTotalDurationSum = 0;
  //   this.setConfCallGeneralChart('call', [], [], []);
  //   this.requestCallGeneralChartData();
  // }
  //
  // selectDateRange(dateRange: DateRange) {
  //   if (dateRange.type === 'UserDefined') {
  //     console.log('$(\'#datePickerModal\') ', $('#datePickerModal'));
  //     $('#datePickerModal').modal({});
  //     return;
  //   } else {
  //     this.selectedDateRange = dateRange;
  //     this.selectDateRangeReal();
  //   }
  // }
  //
  // setupTime(type: String) {
  //   if (type === 'CurMonth') {
  //     const curTime = new Date();
  //     this.startTime = formatDate(curTime, 'yyyy-MM-01T00:00:00.000ZZZZZ', 'en-us');
  //     this.startTimeDisplay = formatDate(curTime, 'yyyy-MM-01', 'en-us');
  //     this.endTime = formatDate(curTime, 'yyyy-MM-ddThh:mm:ss.SSSZZZZZ', 'en-us');
  //     this.endTimeDisplay = formatDate(curTime, 'yyyy-MM-dd', 'en-us');
  //   } else if (type === 'PrevMonth') {
  //     const curTime = new Date();
  //     const curMonthStart = new Date(formatDate(curTime, 'yyyy-MM-01T00:00:00.000ZZZZZ', 'en-us'));
  //     const prevMonthEnd = new Date(curMonthStart.valueOf() - 1);
  //     this.startTime = formatDate(prevMonthEnd, 'yyyy-MM-01T00:00:00.000ZZZZZ', 'en-us');
  //     this.startTimeDisplay = formatDate(prevMonthEnd, 'yyyy-MM-01', 'en-us');
  //     this.endTime = formatDate(prevMonthEnd, 'yyyy-MM-ddThh:mm:ss.SSSZZZZZ', 'en-us');
  //     this.endTimeDisplay = formatDate(prevMonthEnd, 'yyyy-MM-dd', 'en-us');
  //   } else if (type === 'PrevQuarter') {
  //     const curTime = new Date();
  //     let curQuarterBeginMonth: string;
  //     let prevQuarterBeginMonth: string;
  //     if (curTime.getMonth() >= 0 && curTime.getMonth() <= 2) {
  //       curQuarterBeginMonth = '01';
  //       prevQuarterBeginMonth = '10';
  //     } else if (curTime.getMonth() >= 3 && curTime.getMonth() <= 5) {
  //       curQuarterBeginMonth = '04';
  //       prevQuarterBeginMonth = '01';
  //     } else if (curTime.getMonth() >= 6 && curTime.getMonth() <= 8) {
  //       curQuarterBeginMonth = '07';
  //       prevQuarterBeginMonth = '04';
  //     } else if (curTime.getMonth() >= 9 && curTime.getMonth() <= 11) {
  //       curQuarterBeginMonth = '10';
  //       prevQuarterBeginMonth = '07';
  //     }
  //     const curQuarterStart = new Date(formatDate(curTime,
  //       'yyyy-' + curQuarterBeginMonth + '-01T00:00:00.000ZZZZZ', 'en-us'));
  //     const prevQuarterEnd = new Date(curQuarterStart.valueOf() - 1);
  //     const prevQuarterStart = new Date(formatDate(prevQuarterEnd,
  //       'yyyy-' + prevQuarterBeginMonth + '-01T00:00:00.000ZZZZZ', 'en-us'));
  //     this.startTime = formatDate(prevQuarterStart, 'yyyy-MM-01T00:00:00.000ZZZZZ', 'en-us');
  //     this.startTimeDisplay = formatDate(prevQuarterStart, 'yyyy-MM-01', 'en-us');
  //     this.endTime = formatDate(prevQuarterEnd, 'yyyy-MM-ddThh:mm:ss.SSSZZZZZ', 'en-us');
  //     this.endTimeDisplay = formatDate(prevQuarterEnd, 'yyyy-MM-dd', 'en-us');
  //   } else if (type === 'CurYear') {
  //     const curTime = new Date();
  //     const curYearStart = new Date(formatDate(curTime,
  //       'yyyy-01-01T00:00:00.000ZZZZZ', 'en-us'));
  //     this.startTime = formatDate(curYearStart, 'yyyy-MM-01T00:00:00.000ZZZZZ', 'en-us');
  //     this.startTimeDisplay = formatDate(curYearStart, 'yyyy-MM-01', 'en-us');
  //     this.endTime = formatDate(curTime, 'yyyy-MM-ddThh:mm:ss.SSSZZZZZ', 'en-us');
  //     this.endTimeDisplay = formatDate(curTime, 'yyyy-MM-dd', 'en-us');
  //   } else if (type === 'PrevYear') {
  //     const curTime = new Date();
  //     const curYearStart = new Date(formatDate(curTime,
  //       'yyyy-01-01T00:00:00.000ZZZZZ', 'en-us'));
  //     const prevYearEnd = new Date(curYearStart.valueOf() - 1);
  //     this.startTime = formatDate(prevYearEnd, 'yyyy-01-01T00:00:00.000ZZZZZ', 'en-us');
  //     this.startTimeDisplay = formatDate(prevYearEnd, 'yyyy-01-01', 'en-us');
  //     this.endTime = formatDate(prevYearEnd, 'yyyy-MM-ddThh:mm:ss.SSSZZZZZ', 'en-us');
  //     this.endTimeDisplay = formatDate(prevYearEnd, 'yyyy-MM-dd', 'en-us');
  //   }
  //
  //   console.log('startTime ', this.startTime);
  //   console.log('endTime ', this.endTime);
  // }
}

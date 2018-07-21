import {Component, HostBinding, OnInit, HostListener, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

import { NgxEchartsService } from 'ngx-echarts';

import {UserService, ApiService, RefreshSetting, TimeRange} from '../../core';
import { TimeRangeService } from '../../core/services/time-range.service';
import { prettyInterval } from '../../core/ui/datetime-range-picker/pretty_interval';
import { UI_CONFIG } from '../../config';

import { slideInDownAnimation } from '../../animations';

import { CallMonitor } from './call-monitor';
import { AggDatehistgramReq } from './agg-datehistgram-req';
import { AggDatehistgramRsp } from './agg-datehistgram-rsp';
import { AggTermReq } from './agg-term-req';
import { AggTermRsp } from './agg-term-rsp';

import { DateRange } from './date-range';
import * as moment from 'moment';
import _ from 'lodash';

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
  halfMainBodyWidth: number;

  // dateRanges: DateRange[];
  // selectedDateRange: DateRange;

  confGeneralChartEchartsIntance: any;
  callGeneralChartEchartsIntance: any;
  roomTopCountChartEchartsIntance: any;
  roomTopDurationSumChartEchartsIntance: any;
  roomCapacityCountChartEchartsIntance: any;
  roomCapacityDurationSumChartEchartsIntance: any;
  callEpTopCountChartEchartsIntance: any;
  callEpTopDurationSumChartEchartsIntance: any;

  confChartOption: any;
  aggDatehistogramConf: AggDatehistgramReq;
  confTotalCount: number;
  confTotalDurationSum: number;

  callChartOption: any;
  aggDatehistogramCall: AggDatehistgramReq;
  callTotalCount: number;
  callTotalDurationSum: number;

  roomConfTotalCount = 0;
  roomConfTotalDurationSum = 0;
  roomTopConfTotalCount = 0;
  roomTopConfTotalDurationSum = 0;
  roomCapacities: Array<number>;

  roomTopCountChartOption: any;
  roomTopDurationSumChartOption: any;
  roomCapacityCountChartOption: any;
  roomCapacityDurationSumChartOption: any;

  aggTermRoomTopCount: AggTermReq;
  aggTermRoomTopDurationSum: AggTermReq;
  aggTermRoomCapacityCount: AggTermReq;
  aggTermRoomCapacityDurationSum: AggTermReq;

  callEpTopTotalCount = 0;
  callEpTopTotalDurationSum = 0;

  callEpTopCountChartOption: any;
  callEpTopDurationSumChartOption: any;

  aggTermCallEpTopCount: AggTermReq;
  aggTermCallEpTopDurationSum: AggTermReq;

  startTime: String;
  endTime: String;

  startTimeDisplay: String;
  endTimeDisplay: String;

  confGeneralApiCallMonitor = new CallMonitor('confGeneralApiCall');
  callGeneralApiCallMonitor = new CallMonitor('callGeneralApiCall');
  roomTopCountApiCallMonitor = new CallMonitor('roomTopCountApiCall');
  roomTopDurationSumApiCallMonitor = new CallMonitor('roomTopDurationSumApiCall');
  roomCapacityCountApiCallMonitor = new CallMonitor('roomCapacityCountApiCall');
  roomCapacityDurationSumApiCallMonitor = new CallMonitor('roomCapacityDurationSumApiCall');
  callEpTopCountApiCallMonitor = new CallMonitor('callEpTopCountApiCall');
  callEpTopDurationSumApiCallMonitor = new CallMonitor('callEpTopDurationSumApiCall');

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
      this.halfMainBodyWidth = this.mainBodyWidth / 2 - 20;
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

    if (this.roomTopCountChartEchartsIntance) {
      this.roomTopCountChartEchartsIntance.resize();
    }

    if (this.roomTopDurationSumChartEchartsIntance) {
      this.roomTopDurationSumChartEchartsIntance.resize();
    }

    if (this.roomCapacityCountChartEchartsIntance) {
      this.roomCapacityCountChartEchartsIntance.resize();
    }

    if (this.roomCapacityDurationSumChartEchartsIntance) {
      this.roomCapacityDurationSumChartEchartsIntance.resize();
    }

    if (this.callEpTopCountChartEchartsIntance) {
      this.callEpTopCountChartEchartsIntance.resize();
    }

    if (this.callEpTopDurationSumChartEchartsIntance) {
      this.callEpTopDurationSumChartEchartsIntance.resize();
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

    this.roomCapacities = [10, 20, 50, 100, 200, 400, 1000];
    this.roomTopConfTotalCount = 0;
    this.roomTopConfTotalDurationSum = 0;
    this.setRoomTopChart('count', [], []);
    this.setRoomTopChart('durationSum', [], []);
    this.setRoomCapacityChart('count', [], []);
    this.setRoomCapacityChart('durationSum', [], []);

    this.callEpTopTotalCount = 0;
    this.callEpTopTotalDurationSum = 0;
    this.setCallEpTopChart('count', [], []);
    this.setCallEpTopChart('durationSum', [], []);
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
    this.confGeneralApiCallMonitor.start();
    this.apiService.post('/report/agg/datehistgram_stats', aggDatehistogramConf).subscribe(
        data => {
            console.log('DashboardComponent aggDatehistogramConf: rsp ', data);
            this.updateConfGeneralChart(data);
          this.confGeneralApiCallMonitor.finish();
        },
        err => {
          console.log('DashboardComponent aggDatehistogramConf: err ', err);
          this.confGeneralApiCallMonitor.finish();
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
    this.callGeneralApiCallMonitor.start();
    this.apiService.post('/report/agg/datehistgram_stats', aggDatehistogramCall).subscribe(
        data => {
            console.log('DashboardComponent aggDatehistogramCall: rsp ', data);
            this.updateCallGeneralChart(data);
          this.callGeneralApiCallMonitor.finish();
        },
        err => {
          console.log('DashboardComponent aggDatehistogramCall: err ', err);
          this.callGeneralApiCallMonitor.finish();
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

  onRoomTopCountChartInit(ec) {
    this.roomTopCountChartEchartsIntance = ec;
  }

  onRoomTopDurationSumChartInit(ec) {
    this.roomTopDurationSumChartEchartsIntance = ec;
  }

  onRoomCapacityCountChartInit(ec) {
    this.roomCapacityCountChartEchartsIntance = ec;
  }

  onRoomCapacityDurationSumChartInit(ec) {
    this.roomCapacityDurationSumChartEchartsIntance = ec;
  }

  requestRoomTopChartData() {
    if (this.roomTopCountChartEchartsIntance) {
      this.roomTopCountChartEchartsIntance.showLoading();
    }
    if (this.roomTopDurationSumChartEchartsIntance) {
      this.roomTopDurationSumChartEchartsIntance.showLoading();
    }

    const curUser = this.userService.getCurrentUser();
    const aggTermRoomTop: AggTermReq = new AggTermReq();
    aggTermRoomTop.company_id = curUser.profile.orgId;
    aggTermRoomTop.start_time = this.startTime;
    aggTermRoomTop.end_time = this.endTime;
    aggTermRoomTop.target = 'conf';

    aggTermRoomTop.order = 'count';
    this.aggTermRoomTopCount = _.clone(aggTermRoomTop);
    this.roomTopCountApiCallMonitor.start();
    this.apiService.post('/report/agg/term_stats', this.aggTermRoomTopCount).subscribe(
      data => {
        console.log('DashboardComponent aggTermRoomTopCount: rsp ', data);
        this.updateRoomTopCountChart(data);
        this.roomTopCountApiCallMonitor.finish();
      },
      err => {
        console.log('DashboardComponent aggTermRoomTopCount: err ', err);
        this.roomTopCountApiCallMonitor.finish();
      }
    );

    aggTermRoomTop.order = 'sum';
    this.aggTermRoomTopDurationSum = _.clone(aggTermRoomTop);
    this.roomTopDurationSumApiCallMonitor.start();
    this.apiService.post('/report/agg/term_stats', this.aggTermRoomTopDurationSum).subscribe(
      data => {
        console.log('DashboardComponent aggTermRoomTopDurationSum: rsp ', data);
        this.updateRoomTopDurationSumChart(data)
        this.roomTopDurationSumApiCallMonitor.finish();
      },
      err => {
        console.log('DashboardComponent aggTermRoomTopDurationSum: err ', err);
        this.roomTopDurationSumApiCallMonitor.finish();
      }
    );
  }

  requestRoomCapacityChartData() {
    if (this.roomCapacityCountChartEchartsIntance) {
      this.roomCapacityCountChartEchartsIntance.showLoading();
    }
    if (this.roomCapacityDurationSumChartEchartsIntance) {
      this.roomCapacityDurationSumChartEchartsIntance.showLoading();
    }

    const curUser = this.userService.getCurrentUser();
    const aggTermRoomCapacity: AggTermReq = new AggTermReq();
    aggTermRoomCapacity.company_id = curUser.profile.orgId;
    aggTermRoomCapacity.start_time = this.startTime;
    aggTermRoomCapacity.end_time = this.endTime;
    aggTermRoomCapacity.target = 'capacity';
    aggTermRoomCapacity.order = 'key';

    this.aggTermRoomCapacityCount = _.clone(aggTermRoomCapacity);
    this.roomCapacityCountApiCallMonitor.start();
    this.apiService.post('/report/agg/term_stats', this.aggTermRoomCapacityCount).subscribe(
      data => {
        console.log('DashboardComponent aggTermRoomCapacityCount: rsp ', data);
        this.updateRoomCapacityCountChart(data);
        this.roomCapacityCountApiCallMonitor.finish();
      },
      err => {
        console.log('DashboardComponent aggTermRoomCapacityCount: err ', err);
        this.roomCapacityCountApiCallMonitor.finish();
      }
    );

    this.aggTermRoomCapacityDurationSum = _.clone(aggTermRoomCapacity);
    this.roomCapacityDurationSumApiCallMonitor.start();
    this.apiService.post('/report/agg/term_stats', this.aggTermRoomCapacityDurationSum).subscribe(
      data => {
        console.log('DashboardComponent aggTermRoomCapacityDurationSum: rsp ', data);
        this.updateRoomCapacityDurationSumChart(data);
        this.roomCapacityDurationSumApiCallMonitor.finish();
      },
      err => {
        console.log('DashboardComponent aggTermRoomCapacityDurationSum: err ', err);
        this.roomCapacityDurationSumApiCallMonitor.finish();
      }
    );
  }

  setRoomTopChart(target: string, yDataKey: any, yDataValue: any) {
    const echarts = this.es.echarts;

    this.chartResize();

    let seriesName;
    let titleText;
    if (target === 'count') {
      if (this.roomTopCountChartEchartsIntance) {
        this.roomTopCountChartEchartsIntance.hideLoading();
      }
      seriesName = ['数量'];
      titleText = '使用次数';
    } else if (target === 'durationSum') {
      if (this.roomTopDurationSumChartEchartsIntance) {
        this.roomTopDurationSumChartEchartsIntance.hideLoading();
      }
      seriesName = ['时长(小时)'];
      titleText = '使用时长';
    } else {
      return;
    }

    const chartOption = {
      tooltip: {
        trigger: 'axis'
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
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      grid: {
        x: 150
      },
      xAxis : [
        {
          type : 'value',
          boundaryGap : [0, 0.01]
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: yDataKey
        }
      ],
      series: [
        {
          type: 'bar',
          name: seriesName[0],
          data: yDataValue,
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
        }
      ]
    };

    if (target === 'count') {
      this.roomTopCountChartOption = chartOption;
    } else if (target === 'durationSum') {
      this.roomTopDurationSumChartOption = chartOption;
    }
  }

  updateRoomTopCountChart(data: AggTermRsp) {
    const yDataKey = new Array();
    const yDataValue = new Array();
    this.roomTopConfTotalCount = data.count.valueOf();

    for (let idx = 0; idx < data.buckets.length; idx++) {
      yDataKey[data.buckets.length - 1 - idx] = data.buckets[idx].name;
      yDataValue[data.buckets.length - 1 - idx] = data.buckets[idx].count;
    }
    this.setRoomTopChart('count', yDataKey, yDataValue);
  }

  updateRoomTopDurationSumChart(data: AggTermRsp) {
    const yDataKey = new Array();
    const yDataValue = new Array();
    this.roomTopConfTotalDurationSum = Math.round(data.sum.valueOf() / 36) / 100;

    for (let idx = 0; idx < data.buckets.length; idx++) {
      yDataKey[data.buckets.length - 1 - idx] = data.buckets[idx].name;
      yDataValue[data.buckets.length - 1 - idx] = Math.round(data.buckets[idx].sum.valueOf() / 36) / 100;
    }
    this.setRoomTopChart('durationSum', yDataKey, yDataValue);
  }

  setRoomCapacityChart(target: string, dataKey: any, dataValue: any) {
    const echarts = this.es.echarts;

    this.chartResize();

    let seriesName;
    let titleText;
    if (target === 'count') {
      if (this.roomCapacityCountChartEchartsIntance) {
        this.roomCapacityCountChartEchartsIntance.hideLoading();
      }
      seriesName = ['数量'];
      titleText = '使用数量';
    } else if (target === 'durationSum') {
      if (this.roomCapacityDurationSumChartEchartsIntance) {
        this.roomCapacityDurationSumChartEchartsIntance.hideLoading();
      }
      seriesName = ['时长(小时)'];
      titleText = '使用时长';
    } else {
      return;
    }

    const chartOption = {
      tooltip: {
        trigger: 'axis'
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
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      xAxis : [
        {
          type : 'category',
          data: dataKey
        }
      ],
      yAxis: [
        {
          type: 'value',
          boundaryGap : [0, 0.01]
        }
      ],
      series: [
        {
          type: 'bar',
          name: seriesName[0],
          data: dataValue,
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
        }
      ]
    };

    if (target === 'count') {
      this.roomCapacityCountChartOption = chartOption;
    } else if (target === 'durationSum') {
      this.roomCapacityDurationSumChartOption = chartOption;
    }
  }

  updateRoomCapacityCountChart(data: AggTermRsp) {
    const dataKey = new Array();
    const dataValue = new Array();
    this.roomConfTotalCount = data.count.valueOf();

    for (let idx = 0; idx < this.roomCapacities.length; idx++) {
      dataKey[idx] = this.roomCapacities[idx] + '方';
      dataValue[idx] = 0;
    }

    for (let idx = 0; idx < data.buckets.length; idx++) {
      let found = false;
      for (let j = 0; j < this.roomCapacities.length; j++) {
        if (this.roomCapacities[j] === data.buckets[idx].key) {
          found = true;
          dataValue[j] = data.buckets[idx].count;
          break;
        }
      }
      if (!found) {
        dataKey[this.roomCapacities.length] = data.buckets[idx].count + '方';
        dataValue[this.roomCapacities.length] = data.buckets[idx].count;
      }
    }

    this.setRoomCapacityChart('count', dataKey, dataValue);
  }

  updateRoomCapacityDurationSumChart(data: AggTermRsp) {
    const dataKey = new Array();
    const dataValue = new Array();
    this.roomConfTotalDurationSum = Math.round(data.sum.valueOf() / 36) / 100;

    for (let idx = 0; idx < this.roomCapacities.length; idx++) {
      dataKey[idx] = this.roomCapacities[idx] + '方';
      dataValue[idx] = 0;
    }

    for (let idx = 0; idx < data.buckets.length; idx++) {
      let found = false;
      for (let j = 0; j < this.roomCapacities.length; j++) {
        if (this.roomCapacities[j] === data.buckets[idx].key) {
          found = true;
          dataValue[j] = Math.round(data.buckets[idx].sum.valueOf() / 36) / 100;
          break;
        }
      }
      if (!found) {
        dataKey[this.roomCapacities.length] = data.buckets[idx].count + '方';
        dataValue[this.roomCapacities.length] = Math.round(data.buckets[idx].sum.valueOf() / 36) / 100;
      }
    }

    this.setRoomCapacityChart('durationSum', dataKey, dataValue);
  }

  onCallEpTopCountChartInit(ec) {
    this.callEpTopCountChartEchartsIntance = ec;
  }

  onCallEpTopDurationSumChartInit(ec) {
    this.callEpTopDurationSumChartEchartsIntance = ec;
  }

  requestCallEpTopChartData() {
    if (this.callEpTopCountChartEchartsIntance) {
      this.callEpTopCountChartEchartsIntance.showLoading();
    }
    if (this.callEpTopDurationSumChartEchartsIntance) {
      this.callEpTopDurationSumChartEchartsIntance.showLoading();
    }

    const curUser = this.userService.getCurrentUser();
    const aggTermCallEpTop: AggTermReq = new AggTermReq();
    aggTermCallEpTop.company_id = curUser.profile.orgId;
    aggTermCallEpTop.start_time = this.startTime;
    aggTermCallEpTop.end_time = this.endTime;
    aggTermCallEpTop.target = 'device_model';

    aggTermCallEpTop.order = 'count';
    this.aggTermCallEpTopCount = _.clone(aggTermCallEpTop);
    this.callEpTopCountApiCallMonitor.start();
    this.apiService.post('/report/agg/term_stats', this.aggTermCallEpTopCount).subscribe(
      data => {
        console.log('DashboardComponent aggTermCallEpTopCount: rsp ', data);
        this.updateCallEpTopCountChart(data);
        this.callEpTopCountApiCallMonitor.finish();
      },
      err => {
        console.log('DashboardComponent aggTermCallEpTopCount: err ', err);
        this.callEpTopCountApiCallMonitor.finish();
      }
    );

    aggTermCallEpTop.order = 'sum';
    this.aggTermCallEpTopDurationSum = _.clone(aggTermCallEpTop);
    this.callEpTopDurationSumApiCallMonitor.start();
    this.apiService.post('/report/agg/term_stats', this.aggTermCallEpTopDurationSum).subscribe(
      data => {
        console.log('DashboardComponent aggTermCallEpTopDurationSum: rsp ', data);
        this.updateCallEpTopDurationSumChart(data)
        this.callEpTopDurationSumApiCallMonitor.finish();
      },
      err => {
        console.log('DashboardComponent aggTermCallEpTopDurationSum: err ', err);
        this.callEpTopDurationSumApiCallMonitor.finish();
      }
    );
  }

  setCallEpTopChart(target: string, yDataKey: any, yDataValue: any) {
    const echarts = this.es.echarts;

    this.chartResize();

    let seriesName;
    let titleText;
    if (target === 'count') {
      if (this.callEpTopCountChartEchartsIntance) {
        this.callEpTopCountChartEchartsIntance.hideLoading();
      }
      seriesName = ['数量'];
      titleText = '使用次数';
    } else if (target === 'durationSum') {
      if (this.callEpTopDurationSumChartEchartsIntance) {
        this.callEpTopDurationSumChartEchartsIntance.hideLoading();
      }
      seriesName = ['时长(小时)'];
      titleText = '使用时长';
    } else {
      return;
    }

    const chartOption = {
      tooltip: {
        trigger: 'axis'
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
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      grid: {
        x: 250
      },
      xAxis : [
        {
          type : 'value',
          boundaryGap : [0, 0.01]
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: yDataKey
        }
      ],
      series: [
        {
          type: 'bar',
          name: seriesName[0],
          data: yDataValue,
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
        }
      ]
    };

    if (target === 'count') {
      this.callEpTopCountChartOption = chartOption;
    } else if (target === 'durationSum') {
      this.callEpTopDurationSumChartOption = chartOption;
    }
  }

  updateCallEpTopCountChart(data: AggTermRsp) {
    const yDataKey = new Array();
    const yDataValue = new Array();
    this.callEpTopTotalCount = data.count.valueOf();

    for (let idx = 0; idx < data.buckets.length; idx++) {
      yDataKey[data.buckets.length - 1 - idx] = data.buckets[idx].key;
      yDataValue[data.buckets.length - 1 - idx] = data.buckets[idx].count;
    }
    this.setCallEpTopChart('count', yDataKey, yDataValue);
  }

  updateCallEpTopDurationSumChart(data: AggTermRsp) {
    const yDataKey = new Array();
    const yDataValue = new Array();
    this.callEpTopTotalDurationSum = Math.round(data.sum.valueOf() / 36) / 100;

    for (let idx = 0; idx < data.buckets.length; idx++) {
      yDataKey[data.buckets.length - 1 - idx] = data.buckets[idx].key;
      yDataValue[data.buckets.length - 1 - idx] = Math.round(data.buckets[idx].sum.valueOf() / 36) / 100;
    }
    this.setCallEpTopChart('durationSum', yDataKey, yDataValue);
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
    this.requestRoomTopChartData();
    this.requestRoomCapacityChartData();
    this.requestCallEpTopChartData();
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
    if (this.confGeneralApiCallMonitor.active()) {
      return true;
    }
    if (this.callGeneralApiCallMonitor.active()) {
      return true;
    }
    return false;
  }

}

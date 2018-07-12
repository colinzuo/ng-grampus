import { Component, HostBinding, OnInit, HostListener } from '@angular/core';
import { formatDate } from "@angular/common";

import { UserService, ApiService } from '../../core';

import { slideInDownAnimation } from '../../animations';

import { AggDatehistgramReq } from './agg-datehistgram-req';
import { AggDatehistgramRsp } from './agg-datehistgram-rsp';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [slideInDownAnimation]
})
export class DashboardComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;

  screenHeight: number;
  screenWidth: number;
  mainBodyWidth: number;

  startTime: String;
  endTime: String;

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

  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      console.log("DashboardComponent screenWidth ", this.screenWidth);
      console.log("DashboardComponent screenHeight ", this.screenHeight);

      this.mainBodyWidth = this.screenWidth - 300;
      if (this.mainBodyWidth < 500) {
        this.mainBodyWidth = 500;
      }
      console.log("DashboardComponent mainBodyWidth ", this.mainBodyWidth);

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

  setupTime() {
    var curTime = new Date();
    this.startTime = formatDate(curTime, "yyyy-MM-01T00:00:00.000ZZZZZ", "en-us");
    this.endTime = formatDate(curTime, "yyyy-MM-ddThh:mm:ss.SSSZZZZZ", "en-us");
    console.log("startTime ", this.startTime);
    console.log("endTime ", this.endTime);
  }

  constructor(private userService: UserService,
    private apiService: ApiService) {
    }

  ngOnInit() {
    this.onResize();
    this.setupTime();
    
    this.confTotalCount = 0;
    this.confTotalDurationSum = 0;
    this.setConfCallGeneralChart("conf", [], [], []);
    this.requestConfGeneralChartData();

    this.callTotalCount = 0;
    this.callTotalDurationSum = 0;
    this.setConfCallGeneralChart("call", [], [], []);
    this.requestCallGeneralChartData();
  } 

  onConfGeneralChartInit(ec) {
    this.confGeneralChartEchartsIntance = ec;
  }

  onCallGeneralChartInit(ec) {
    this.callGeneralChartEchartsIntance = ec;
  }

  setConfCallGeneralChart(target:string, xData: any, yDataCount: any, yDataDurationSum: any) {
    this.chartResize();

    var seriesName;
    var titleText;
    if (target == "conf") {
      if (this.confGeneralChartEchartsIntance) {
        this.confGeneralChartEchartsIntance.hideLoading();
      }
      seriesName = ['会议数量','会议时长'];
      titleText = '会议数量时长图';
    } else if (target == "call") {
      if (this.callGeneralChartEchartsIntance) {
        this.callGeneralChartEchartsIntance.hideLoading();
      }
      seriesName = ['呼叫数量','呼叫时长'];
      titleText = '呼叫数量时长图';
    } else {
      return;
    }

    var chartOption = {
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
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
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
                smooth:true,
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
                smooth:true,
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

    if (target == "conf") {
      this.confChartOption = chartOption;
    } else if (target == "call") {
      this.callChartOption = chartOption;
    }
  }

  requestConfGeneralChartData() {
    if (this.confGeneralChartEchartsIntance) {
        this.confGeneralChartEchartsIntance.showLoading();
    }
    var curUser = this.userService.getCurrentUser();
    var aggDatehistogramConf: AggDatehistgramReq = new AggDatehistgramReq();
    aggDatehistogramConf.company_id = curUser.profile.orgId;
    aggDatehistogramConf.start_time = this.startTime;
    aggDatehistogramConf.end_time = this.endTime;
    aggDatehistogramConf.interval = "1d";
    aggDatehistogramConf.time_zone = "+08:00";
    aggDatehistogramConf.format = "yyyy-MM-dd";
    aggDatehistogramConf.target = "conf";
    this.aggDatehistogramConf = aggDatehistogramConf;
    this.apiService.post("/report/agg/datehistgram_stats", aggDatehistogramConf).subscribe(
        data => {
            console.log("DashboardComponent aggDatehistogramConf: rsp ", data);
            this.updateConfGeneralChart(data);
        },
        err => console.log("DashboardComponent aggDatehistogramConf: err ", err)
    )
  }

  updateConfGeneralChart(data: AggDatehistgramRsp) {
    var xData = new Array();
    var yDataCount = new Array();
    var yDataDurationSum = new Array();
    this.confTotalCount = 0;
    this.confTotalDurationSum = 0;
    
    for (var idx = 0; idx < data.buckets.length; idx++) {
        xData[idx] = data.buckets[idx].key_as_string;
        yDataCount[idx] = data.buckets[idx].count;
        yDataDurationSum[idx] = Math.round(data.buckets[idx].sum.valueOf() / 36) / 100;

        this.confTotalCount += yDataCount[idx];
        this.confTotalDurationSum += yDataDurationSum[idx];
    }
    this.confTotalDurationSum = Math.round(this.confTotalDurationSum * 100) / 100;
    this.setConfCallGeneralChart("conf", xData, yDataCount, yDataDurationSum);
  }

  requestCallGeneralChartData() {
    if (this.callGeneralChartEchartsIntance) {
        this.callGeneralChartEchartsIntance.showLoading();
    }
    var curUser = this.userService.getCurrentUser();
    var aggDatehistogramCall: AggDatehistgramReq = new AggDatehistgramReq();
    aggDatehistogramCall.company_id = curUser.profile.orgId;
    aggDatehistogramCall.start_time = this.startTime;
    aggDatehistogramCall.end_time = this.endTime;
    aggDatehistogramCall.interval = "1d";
    aggDatehistogramCall.time_zone = "+08:00";
    aggDatehistogramCall.format = "yyyy-MM-dd";
    aggDatehistogramCall.target = "call";
    this.aggDatehistogramCall = aggDatehistogramCall;
    this.apiService.post("/report/agg/datehistgram_stats", aggDatehistogramCall).subscribe(
        data => {
            console.log("DashboardComponent aggDatehistogramCall: rsp ", data);
            this.updateCallGeneralChart(data);
        },
        err => console.log("DashboardComponent aggDatehistogramCall: err ", err)
    )
  }

  updateCallGeneralChart(data: AggDatehistgramRsp) {
    var xData = new Array();
    var yDataCount = new Array();
    var yDataDurationSum = new Array();
    this.callTotalCount = 0;
    this.callTotalDurationSum = 0;
    
    for (var idx = 0; idx < data.buckets.length; idx++) {
        xData[idx] = data.buckets[idx].key_as_string;
        yDataCount[idx] = data.buckets[idx].count;
        yDataDurationSum[idx] = Math.round(data.buckets[idx].sum.valueOf() / 36) / 100;

        this.callTotalCount += yDataCount[idx];
        this.callTotalDurationSum += yDataDurationSum[idx];
    }
    this.callTotalDurationSum = Math.round(this.callTotalDurationSum * 100) / 100;
    this.setConfCallGeneralChart("call", xData, yDataCount, yDataDurationSum);
  }
}

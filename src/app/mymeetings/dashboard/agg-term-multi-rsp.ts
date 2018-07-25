export class AggBucketStatsItem {
  count: number;
  min: number;
  max: number;
  avg: number;
  sum: number;
}

export class AggBucketTermMultiStatsItem {
  key: Number;
  key_as_string: String;
  group: any;
  user: any;
  room: any;
  call_cnt_all: AggBucketStatsItem;
  call_cnt_self: AggBucketStatsItem;
  call_duration_all: AggBucketStatsItem;
  call_duration_self: AggBucketStatsItem;
  conf_duration: AggBucketStatsItem;
  conf_cnt: AggBucketStatsItem;
}

export class AggTermMultiRsp {
  guid: String;
  err_code: Number;
  err_info: String;
  more_info: String;
  buckets: AggBucketTermMultiStatsItem[];
}

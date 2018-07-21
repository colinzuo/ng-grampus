export class AggBucketTermStatsItem {
  key: Number;
  key_as_string: String;
  'name': string;
  count: Number;
  min: Number;
  max: Number;
  avg: Number;
  sum: Number;
}

export class AggTermRsp {
  guid: String;
  err_code: Number;
  err_info: String;
  more_info: String;
  count: Number;
  sum: Number;
  buckets: AggBucketTermStatsItem[];
}

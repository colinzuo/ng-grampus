export class AggBucketHistogramStatsItem {
    key: Number;
    key_as_string: String;
    count: Number;
    min: Number;
    max: Number;
    avg: Number;
    sum: Number;
}

export class AggDatehistgramRsp {
    guid: String;
    err_code: Number;
    err_info: String;
    more_info: String;
    count: Number;
    sum: Number;
    buckets: AggBucketHistogramStatsItem[];
}
export class AggTermMultiReq {
  constructor() {
    this.order = 'key';
    this.param1 = 'all';
  }
  guid: string;
  group_ids: Array<number>;
  start_time: String;
  end_time: String;
  size: number;
  order: string;
  target: string;
  param1: string;
}

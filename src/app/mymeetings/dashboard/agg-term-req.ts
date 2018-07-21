export class AggTermReq {
  constructor() {
    this.size = 10;
  }
  guid: string;
  agent_id: number;
  company_id: number;
  dept_id: number;
  start_time: String;
  end_time: String;
  size: number;
  order: string;
  target: string;
  param1: string;
}

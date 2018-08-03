export class CallMonitor {
  constructor(name: string) {
    this.name = name;
    this.callCount = 0;
  }
  name: string;
  timerId: any;
  callCount: number;

  start() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.timerId = setTimeout(() => {
      if (this.callCount !== 0) {
        console.log('start timeout: unexpected ', name, ': ', this.callCount);
        this.callCount = 0;
      }
      this.timerId = undefined;
    }, 20000);
    this.callCount++;
  }

  finish() {
    if (this.callCount > 0) {
      this.callCount--;
    } else {
      console.log('finish: unexpected ', name, ': ', this.callCount);
    }
  }

  active() {
    if (this.callCount > 0) {
      return true;
    } else {
      return false;
    }
  }
}

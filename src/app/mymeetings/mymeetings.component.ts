import { Component, OnInit, HostBinding, HostListener } from '@angular/core';

import { slideInDownAnimation } from '../animations';

@Component({
  templateUrl: './mymeetings.component.html',
  animations: [slideInDownAnimation]
})
export class MymeetingsComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;

  screenHeight: number;
  screenWidth: number;
  navPanelWidth: number;
  mainBodyWidth: number;

  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      console.log("MymeetingsComponent screenWidth ", this.screenWidth);
      console.log("MymeetingsComponent screenHeight ", this.screenHeight);

      this.navPanelWidth = 200;
      this.mainBodyWidth = this.screenWidth - this.navPanelWidth - 50;
      if (this.mainBodyWidth < 500) {
        this.mainBodyWidth = 500;
      }

      console.log("MymeetingsComponent navPanelWidth ", this.navPanelWidth);
      console.log("MymeetingsComponent mainBodyWidth ", this.mainBodyWidth);
  }

  constructor() { }

  ngOnInit() {
    this.onResize();
  }

}

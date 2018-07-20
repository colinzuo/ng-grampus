import { Component, OnInit, HostBinding, HostListener } from '@angular/core';

import { slideInDownAnimation } from '../animations';

import { UI_CONFIG } from '../config';

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

    this.navPanelWidth = UI_CONFIG.NAV_PANEL_WIDTH;
    this.mainBodyWidth = this.screenWidth - UI_CONFIG.NAV_PANEL_WIDTH 
      - UI_CONFIG.RESERVE_WIDTH;
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

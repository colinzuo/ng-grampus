import { Component, OnInit, HostBinding } from '@angular/core';

import { slideInDownAnimation } from '../animations';

@Component({
  templateUrl: './mymeetings.component.html',
  animations: [slideInDownAnimation]
})
export class MymeetingsComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';
  @HostBinding('style.position')  position = 'absolute';

  constructor() { }

  ngOnInit() {
  }

}

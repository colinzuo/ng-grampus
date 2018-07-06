import { Component, HostBinding } from '@angular/core';

import { slideInDownAnimation } from '../../animations';

@Component({
  template: `
    <p>Welcome to the Dashboard</p>
  `,
  animations: [slideInDownAnimation]
})
export class DashboardHomeComponent { 
    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display')   display = 'block';
    @HostBinding('style.position')  position = 'absolute';
}
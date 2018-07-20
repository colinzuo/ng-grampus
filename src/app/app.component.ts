import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthed: boolean;

  constructor (private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.populate();
    this.userService.isAuthenticated.subscribe((isAuthed) => {
      console.log("AppComponent ngOnInit: isAuthed ", isAuthed);
      this.isAuthed = isAuthed;
    });
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigate(["/login"]);
  }
}

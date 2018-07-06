import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Errors, UserService, ApiService } from '../core';

import { slideInDownAnimation } from '../animations';

declare var jsSHA: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [slideInDownAnimation]
})
export class LoginComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;

  title: String;
  errors: Errors = {errors: {}};
  isSubmitting = false;
  authForm: FormGroup;

  remember: boolean;
  apiUrl: string;
  username: string;
  passwordHash: string;

  message: string;
  credentials: any;

  shaObj:any;
  hash:string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private apiService: ApiService,
    private fb: FormBuilder) { 
      // use FormBuilder to create a form group
      this.authForm = this.fb.group({
        'apiUrl': ['', Validators.required],
        'username': ['', Validators.required],
        'password': ['', Validators.required],
        'remember': ['']
      });
    }

  ngOnInit() {
    this.title = 'Sign In';
    this.message = '';

    this.remember = window.localStorage['remember']  || true;
    this.apiUrl = window.localStorage['apiUrl'] || "";
    this.username = window.localStorage['username'] || "";
    this.passwordHash = window.localStorage['passwordHash'] || "";

    this.authForm.setValue({
      apiUrl: this.apiUrl,
      username: this.username,
      password: this.passwordHash,
      remember: this.remember
    });
  }

  login() {
    this.message = 'Trying to log in ...';

    this.apiUrl = this.authForm.get('apiUrl').value;
    this.username = this.authForm.get('username').value;
    this.remember = this.authForm.get('remember').value;

    var passwordHash = this.passwordHash
    var password = this.authForm.get('password').value;
    if (password != passwordHash) {
      this.shaObj = new jsSHA("SHA-1", "TEXT");
      this.shaObj.update(password);
      this.passwordHash = this.shaObj.getHash("HEX")
    }
    
    if (!this.remember) {
      window.localStorage.removeItem('remember');
      window.localStorage.removeItem('apiUrl');
      window.localStorage.removeItem('username');
      window.localStorage.removeItem('passwordHash');
    } else {
      window.localStorage['remember'] = this.remember;
      window.localStorage['apiUrl'] = this.apiUrl;
      window.localStorage['username'] = this.username;
      window.localStorage['passwordHash'] = this.passwordHash;
    }

    this.credentials = {
      account: this.username, 
      password: this.passwordHash
    }

    this.apiService.setApiUrl(this.apiUrl);
    this.apiService.saveApiUrl();
 
    this.userService.attemptAuth(this.credentials).subscribe(
      () => {
          this.router.navigate(["mymeetings"]);
      },
      err => {
        this.errors = err;
        this.isSubmitting = false;
        this.message = '';
      }
    );
  }
}

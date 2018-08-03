import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import {ApiService, Errors} from '../core';
import {CallMonitor} from '../core/shared/call-monitor';

import { slideInDownAnimation } from '../animations';

import * as moment from 'moment';
import _ from 'lodash';
import {LocateDomainZoneReq} from './locate-domain-zone-req';

declare var $: any;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [slideInDownAnimation]
})
export class LocationComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;

  locateDomainZoneApiCallMonitor = new CallMonitor('locateDomainZoneApiCall');
  remember: boolean;
  epIp: string;
  apiUrl: string;
  message: string;
  domain: string;
  zone: string;

  errors: Errors = {errors: {}};
  isSubmitting = false;
  ldzForm: FormGroup;

  constructor(private apiService: ApiService,
              private fb: FormBuilder) {
    this.ldzForm = this.fb.group({
      'apiUrl': ['', Validators.required],
      'epIp': ['', Validators.required],
      'remember': ['']
    });
  }

  ngOnInit() {
    this.message = '';
    this.domain = '';
    this.zone = '';

    this.remember = window.localStorage['locationRemember']  || true;
    this.apiUrl = window.localStorage['locationApiUrl'] || '';
    this.epIp = window.localStorage['locationEpIp'] || '';

    this.ldzForm.setValue({
      apiUrl: this.apiUrl,
      epIp: this.epIp,
      remember: this.remember
    });
  }

  locateDomainZone() {
    this.message = 'Trying to locate domain zone ...';

    this.apiUrl = this.ldzForm.get('apiUrl').value;
    this.epIp = this.ldzForm.get('epIp').value;
    this.remember = this.ldzForm.get('remember').value;

    if (!this.remember) {
      window.localStorage.removeItem('locationRemember');
      window.localStorage.removeItem('locationApiUrl');
      window.localStorage.removeItem('locationEpIp');
    } else {
      window.localStorage['locationRemember'] = this.remember;
      window.localStorage['locationApiUrl'] = this.apiUrl;
      window.localStorage['locationEpIp'] = this.epIp;
    }

    const locateDomainZoneReq = new LocateDomainZoneReq();
    locateDomainZoneReq.guid = moment().format('YYYY-MM-DD HH:mm:ss');
    locateDomainZoneReq.ipaddr = this.epIp;

    this.locateDomainZoneApiCallMonitor.start();
    this.apiService.post('/location/locate_domain_zone', locateDomainZoneReq, this.apiUrl).subscribe(
      data => {
        console.log('locateDomainZone: rsp ', data);
        this.locateDomainZoneApiCallMonitor.finish();
        this.isSubmitting = false;
        this.message = '';
        this.domain = data.domain;
        this.zone = data.zone;
      },
      err => {
        console.log('locateDomainZone: err ', err);
        this.locateDomainZoneApiCallMonitor.finish();
        this.errors = {errors: {'locateDomainZone: ': err}};
        this.isSubmitting = false;
        this.message = '';
        this.domain = '';
        this.zone = '';
      }
    );
  }

  get isLoading() {
    if (this.locateDomainZoneApiCallMonitor.active()) {
      return true;
    }

    return false;
  }
}

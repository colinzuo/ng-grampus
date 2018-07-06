import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtService } from './jwt.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: string;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {
    this.apiUrl = "";
  }

  private formatErrors(error: any) {
    return  throwError(error.error);
  }

  setApiUrl(apiUrl: string) {
    console.log("ApiService: setApiUrl ", apiUrl);
    this.apiUrl = apiUrl;
  }

  saveApiUrl() {
    window.localStorage['apiUrl'] = this.apiUrl;
  }

  loadApiUrl() {
    this.apiUrl = window.localStorage['apiUrl'];
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${this.apiUrl}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${this.apiUrl}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${this.apiUrl}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}${path}`
    ).pipe(catchError(this.formatErrors));
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
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
    this.apiUrl = '';
  }

  private formatErrors(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  setApiUrl(apiUrl: string) {
    console.log('ApiService: setApiUrl ', apiUrl);
    this.apiUrl = apiUrl;
  }

  saveApiUrl() {
    window.localStorage['apiUrl'] = this.apiUrl;
  }

  loadApiUrl() {
    this.apiUrl = window.localStorage['apiUrl'];
  }

  get(path: string, params: HttpParams = new HttpParams(), targetUrl: string = ''): Observable<any> {
    if (targetUrl === '') {
      targetUrl = this.apiUrl;
    }
    return this.http.get(`${targetUrl}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}, targetUrl: string = ''): Observable<any> {
    if (targetUrl === '') {
      targetUrl = this.apiUrl;
    }
    return this.http.put(
      `${targetUrl}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}, targetUrl: string = ''): Observable<any> {
    if (targetUrl === '') {
      targetUrl = this.apiUrl;
    }
    return this.http.post(
      `${targetUrl}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  delete(path, targetUrl: string = ''): Observable<any> {
    if (targetUrl === '') {
      targetUrl = this.apiUrl;
    }
    return this.http.delete(
      `${targetUrl}${path}`
    ).pipe(catchError(this.formatErrors));
  }
}

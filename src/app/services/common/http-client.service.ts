import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(private http: HttpClient, @Inject('baseUrl') private baseUrl: string) {}

  private url(requestParameter: Partial<RequestParameters>): string {
    return `${requestParameter.baseUrl ? requestParameter.baseUrl : this.baseUrl}/${requestParameter.controller}${requestParameter.action ? `/${requestParameter.action}` : ''}`;
  }

  get<T>(requestParameter: Partial<RequestParameters>, id?: string): Observable<T> {
    let url: string = '';
    if (requestParameter.fullEndPoint) {
      url = requestParameter.fullEndPoint;
    } else {
      url = `${this.url(requestParameter)}${id ? `/${id}` : ''}`;
    }
    return this.http.get<T>(url);
  }
  post<T>(requestParameter: Partial<RequestParameters>, body: Partial<T>): Observable<T> {
    let url: string = '';
    if (requestParameter.fullEndPoint) {
      url = requestParameter.fullEndPoint;
    } else {
      url = `${this.url(requestParameter)}`;
    }
    return this.http.post<T>(url, body);
  }
  put<T>(requestParameter: Partial<RequestParameters>, body: Partial<T>): Observable<T> {
    let url = '';
    if (requestParameter.fullEndPoint) {
      url = requestParameter.fullEndPoint;
    } else {
      url = `${this.url(requestParameter)}`;
    }
    return this.http.put<T>(url, body);
  }
  delete<T>(requestParameter: Partial<RequestParameters>, id: string): Observable<T> {
    let url = '';
    if (requestParameter.fullEndPoint) {
      url = requestParameter.fullEndPoint;
    } else {
      url = `${this.url(requestParameter)}/${id}`;
    }
    return this.http.delete<T>(url);
  }
}

export class RequestParameters {
  controller?: string;
  action?: string;

  headers?: string;
  baseUrl?: string;
  fullEndPoint?: string;
}

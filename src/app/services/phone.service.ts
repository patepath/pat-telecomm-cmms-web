import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResult, Phone, User } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  constructor(private readonly _http: HttpClient) { }

  findall(): Observable<Phone[]> {
    return this._http.get<Phone[]>(`${URLAPI}/phone/findall`);
  }

  findbynumber(num: string): Observable<Phone[]> {
    return this._http.get<Phone[]>(`${URLAPI}/phone/findbynumber/${num}`);
  }

  save(token: string, phone: Phone): Observable<APIResult> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    let options = { headers: headers };
    let body = phone

    return this._http.post<APIResult>(`${URLAPI}/phone/save/${token}`, body, options)
  }
}

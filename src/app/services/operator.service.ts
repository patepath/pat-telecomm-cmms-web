import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { APIResult, Operator } from '../interfaces';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

  constructor(private readonly _http: HttpClient) { }

  findall(): Observable<Operator[]> {
    return this._http.get<Operator[]>(`${URLAPI}/operator/findall`);
  }

  findByPhone(phonenumber: string): Observable<Operator[]> {
    return this._http.get<Operator[]>(`${URLAPI}/operator/findbyphone/${phonenumber}`);
  }

  save(token: string, operator: Operator): Observable<APIResult> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    let options = { headers: headers };
    let body = operator

    return this._http.post<APIResult>(`${URLAPI}/operator/save/${token}`, body, options)
  }
}

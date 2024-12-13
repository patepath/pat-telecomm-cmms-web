import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResult, Part, PartProfile } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class PartService {

  constructor(private readonly _http: HttpClient) { }

  findallpartprofile(): Observable<PartProfile[]> {
    return this._http.get<PartProfile[]>(`${URLAPI}/partprofile/findall`);
  }

  savepartprofile(token: string, payload: PartProfile): Observable<APIResult> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    let options = { headers: headers };
    let body = payload
    return this._http.post<APIResult>(`${URLAPI}/partprofile/save/${token}`, body, options)
  }

  findall(): Observable<Part[]> {
    return this._http.get<Part[]>(`${URLAPI}/part/findall`) 
  }

  save(token: string, part: Part): Observable<APIResult> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    let options = { headers: headers };
    let body = part
    return this._http.post<APIResult>(`${URLAPI}/part/save/${token}`, body, options)
  }
}

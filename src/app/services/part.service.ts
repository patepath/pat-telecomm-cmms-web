import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResult, Part } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class PartService {

  constructor(private readonly _http: HttpClient) { }

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

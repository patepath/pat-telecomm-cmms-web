import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { LineswapIssue } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class LineswapFinishedService {

  constructor(private readonly _http: HttpClient) { }

  findall(token: string): Observable<LineswapIssue[]> {
    return this._http.get<LineswapIssue[]>(`${URLAPI}/lineswap/findfinished/${token}`);
  }

  findByDate(token: string, frm: string, to: string): Observable<LineswapIssue[]> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    let options = { headers: headers };

    return this._http.get<LineswapIssue[]>(`${URLAPI}/lineswap/findbydate/${frm}/${to}`, options);
  }
}

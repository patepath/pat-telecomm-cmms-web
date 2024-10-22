import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class JobsCompletedService {

  constructor(private readonly _http: HttpClient) { }

  findall(token: string): Observable<Issue[]> {
    return this._http.get<Issue[]>(`${URLAPI}/issue/findcompleted/${token}`)
  }

  findbydate(token: string, frmdate: string, todate: string): Observable<Issue[]> {
    return this._http.get<Issue[]>(`${URLAPI}/issue/findbydate/${token}/${frmdate}/${todate}`)
  }
}

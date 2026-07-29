import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LineswapIssue, LineswapReport } from '../interfaces';
import { Observable } from 'rxjs/internal/Observable';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class LineswapReportService {

  constructor(private readonly _http: HttpClient) { }

  reportdailyall(token: string, date: string): Observable<LineswapReport[]> {
    return this._http.get<LineswapReport[]>(`${URLAPI}/lineswap/reportdailyall/${token}/${date}`);
  }

  reportbyperiod(token: string, frmdate: string, todate: string): Observable<LineswapIssue[]> {
    return this._http.get<LineswapIssue[]>(`${URLAPI}/lineswap/reportbyperiod/${token}/${frmdate}/${todate}`);
  }

  reportdaily(token: string, date: string, type: number): Observable<LineswapReport[]> {
    return this._http.get<LineswapReport[]>(`${URLAPI}/lineswap/reportdaily/${token}/${date}/${type}`);
  }

  reportperiodall(token: string, frmdate: string, todate: string): Observable<LineswapReport[]> {
    return this._http.get<LineswapReport[]>(`${URLAPI}/lineswap/reportperiodall/${token}/${frmdate}/${todate}`);
  }

  reportperiod(token: string, frmdate: string, todate: string, type: number): Observable<LineswapReport[]> {
    return this._http.get<LineswapReport[]>(`${URLAPI}/lineswap/reportperiod/${token}/${frmdate}/${todate}/${type}`);
  }
}

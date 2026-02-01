import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { APIResult, IssueType, LineswapIssue } from '../interfaces';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class LineswapService {

  constructor(private readonly _http: HttpClient) { }

  getIssueTypes(): Observable<IssueType[]> {
    return of([ 
      { value: 0, name: '- เลือก -'},
      { value: 1, name: 'โอนสาย'},
      { value: 2, name: 'ติดต่อสอบถาม'},
      { value: 3, name: 'แจ้งเสีย'},
      { value: 99, name: 'อื่นๆ'},
    ]);
  }

  save(token: string, lineswapissue: LineswapIssue): Observable<APIResult> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    let options = { headers: headers };
    let body = lineswapissue

    return this._http.post<APIResult>(`${URLAPI}/lineswap/save/${token}`, body, options);
  }
}

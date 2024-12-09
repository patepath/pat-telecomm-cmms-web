import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { APIfileAttach, APIget, APIResult, Issue, IssueType } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(private readonly _http: HttpClient) { }

  getIssueTypes(): Observable<IssueType[]> {
    return of([ 
      { value: 0, name: '- เลือก -'},
      { value: 1, name: 'แจ้งเหตุเสีย'},
      { value: 2, name: 'ติดตั้งเลขหมายใหม่'},
      { value: 3, name: 'ติดตั้งเครื่องพ่วง'},
      { value: 4, name: 'ปรับปรุงสาย'},
      { value: 5, name: 'ย้าย'},
      { value: 6, name: 'เปลี่ยนเครื่อง'},
      { value: 99, name: 'อื่นๆ'},
    ]);
  }

  save(token: string, issue: Issue, isattach: boolean, isparts: boolean): Observable<APIResult> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    let options = { headers: headers };
    let body = issue
    return this._http.post<APIResult>(`${URLAPI}/issue/save/${token}/${isattach}/${isparts}`, body, options)
  }

  checkfileattach(issueno: string): Observable<APIfileAttach> { 
    return this._http.get<APIfileAttach>(`${URLAPI}/issue/checkfileattach/${issueno}`)
  }

  upload(token: string, order: string, issueno: string, file: File): Observable<APIResult> {
    const frmData = new FormData();
    frmData.append("order", order);
    frmData.append("issueno", issueno);
    frmData.append("file", file);
    return this._http.post<any>(`${URLAPI}/issue/upload/${token}`, frmData)
  }

  findById(token: string, id: number): Observable<Issue> {
    return this._http.get<Issue>(`${URLAPI}/issue/findbyid/${token}/${id}`);
  }

  findAllByDate(token: string, frmdate: string, todate: string): Observable<Issue[]> {
    return this._http.get<Issue[]>(`${URLAPI}/issue/findallbydate/${token}/${frmdate}/${todate}`);
  }

  summaryByDate(token: string, frmdate: string, todate: string): Observable<any[]> {
    return this._http.get<any[]>(`${URLAPI}/issue/summarybydate/${token}/${frmdate}/${todate}`);
  }

}

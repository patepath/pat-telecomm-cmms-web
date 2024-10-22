import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResult, User } from '../interfaces';
import { environment } from '../../environments/environment';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly _http: HttpClient) { }

  gettech(token: string): Observable<User[]> {
    return this._http.get<User[]>(`${URLAPI}/user/gettech/${token}`) 
  }

  findall(token: string): Observable<User[]> {
    return this._http.get<User[]>(`${URLAPI}/user/findall/${token}`) 
  }

  save(token: string, user: User): Observable<APIResult> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    let options = { headers: headers };
    let body = user
    return this._http.post<APIResult>(`${URLAPI}/user/save/${token}`, body, options)
  }

  changepassword(token: string, user: User): Observable<APIResult> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    let options = { headers: headers };
    let body = user
    return this._http.post<APIResult>(`${URLAPI}/user/changepassword/${token}`, body, options)
  }
}

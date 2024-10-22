import { Injectable } from '@angular/core';
import { LoginInfo } from '../interfaces';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Md5 } from 'md5-typescript'
import { environment } from '../../environments/environment';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private readonly _http: HttpClient) { 
  }

  login(name: String, password: String): Observable<LoginInfo> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    let options = { headers: headers };

    let passwordMD5 = Md5.init(password);
    let body = { name: name, password: passwordMD5 }

    return this._http.post<LoginInfo>(`${URLAPI}/login`, body, options);
  }

  chektoken(token: string): Observable<LoginInfo> {
    return this._http.get<LoginInfo>(`${URLAPI}/checktoken/${token}`);
  }
}

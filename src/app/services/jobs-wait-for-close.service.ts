import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../interfaces';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class JobsWaitForCloseService {

  constructor(private readonly _http: HttpClient) { }

  findall(token: string): Observable<Issue[]> {
    return this._http.get<Issue[]>(`${URLAPI}/issue/findwaitforclose/${token}`); 
  }
}

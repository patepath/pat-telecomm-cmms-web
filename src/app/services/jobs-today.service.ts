import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue } from '../interfaces';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class JobsTodayService {

  constructor(private readonly _http: HttpClient) { }

  findall(token: string): Observable<Issue[]> {
    return this._http.get<Issue[]>(`${URLAPI}/issue/findtoday/${token}`);
  }
}

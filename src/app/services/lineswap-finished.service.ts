import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { LineswapIssue } from '../interfaces';
import { HttpClient } from '@angular/common/http';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class LineswapFinishedService {

  constructor(private readonly _http: HttpClient) { }

  findall(token: string): Observable<LineswapIssue[]> {
    return this._http.get<LineswapIssue[]>(`${URLAPI}/lineswap/findfinished/${token}`);
  }

}

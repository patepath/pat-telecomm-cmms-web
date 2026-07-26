import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Issue, LineswapIssue } from '../interfaces';
import { Observable } from 'rxjs/internal/Observable';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class LineswapEditService {

  constructor(private readonly _http: HttpClient) { }

  findbyid(token: string, id: number): Observable<LineswapIssue> {
    return this._http.get<LineswapIssue>(`${URLAPI}/lineswap/findbyid/${token}/${id}`);
  }

}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../interfaces';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private readonly _http: HttpClient) { }

  findall(): Observable<Department[]> {
    return this._http.get<Department[]>(`${URLAPI}/department/findall`);
  }
}

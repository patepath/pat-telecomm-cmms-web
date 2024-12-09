import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URLAPI = environment.urlapi

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _http: HttpClient) { }

  get(): Observable<Profile> {
    return this._http.get<Profile>(`${URLAPI}/profile/getone`);
  }
  
  save(profile: Profile): Observable<Profile> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    let options = { headers: headers };
    let body = profile

    return this._http.post<Profile>(`${URLAPI}/profile/save`, body, options);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment.prod';
import { Observable } from 'rxjs';
import { User } from './user.type';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  url = environment.apiBaseUrl

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }



  getUserFromId(iduser?: number): Observable<User> {

    return this.http.get<User>(`${this.url}/users/${iduser}`, this.httpOptions);
  }

}

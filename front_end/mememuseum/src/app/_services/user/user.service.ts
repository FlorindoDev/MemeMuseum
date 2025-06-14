import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment.prod';
import { Observable } from 'rxjs';
import { User } from './user.type';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiBaseUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }



  getUserFromId(iduser: number | string): Observable<User> {
    return this.http.get<User>(`${this.url}/users/${iduser}`, this.httpOptions);
  }

  saveUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  deleteUser() {
    localStorage.removeItem("user");
  }

  getProfilePic(): string | null {


    const profile = localStorage.getItem("user");
    if (profile) {
      return (JSON.parse(profile) as User).profilePic;
    }

    return null;

  }

  getNickName(): string | null {


    const nickName = localStorage.getItem("user");
    if (nickName) {
      return (JSON.parse(nickName) as User).nickName;
    }

    return null;

  }


}

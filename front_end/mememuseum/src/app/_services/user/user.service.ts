import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment.prod';
import { Observable, of } from 'rxjs';
import { User } from './user.type';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

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

  constructor(private http: HttpClient, private AuthService: AuthService) { }



  getUserFromId(iduser: number | string): Observable<User> {
    return this.http.get<User>(`${this.url}/users/${iduser}`, this.httpOptions);
  }

  saveUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  getProfilePic(): string | null {
    if (!this.AuthService.isUserAuthenticated()) {
      return null;
    }

    const profile = localStorage.getItem("user");
    if (profile) {
      return (JSON.parse(profile) as User).profilePic;
    }

    return null;

  }

}

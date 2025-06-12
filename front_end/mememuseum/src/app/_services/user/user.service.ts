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



  getUserFromId(iduser?: number): Observable<User> {

    return this.http.get<User>(`${this.url}/users/${iduser}`, this.httpOptions);
  }

  //TODO Aggiustare fare che prende tutto e salva tutto
  getAndSaveProfilePic(): Observable<string | null> {
    const iduser = this.AuthService.getidUser();

    return this.http.get<User>(`${this.url}/users/${iduser}`, this.httpOptions).pipe(
      map((val) => {
        const profile = val.profilePic;
        if (profile !== null) localStorage.setItem("ProfilePic", `${profile}`);

        return profile;
      })
    );
  }

  getProfilePic(): Observable<string | null> {
    if (!this.AuthService.isUserAuthenticated()) {
      return of(null);
    }

    const profile = localStorage.getItem("ProfilePic");
    if (profile) {
      return of(profile);
    }

    return this.getAndSaveProfilePic(); // ora è un Observable valido
  }

}

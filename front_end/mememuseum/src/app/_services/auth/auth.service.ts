import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { AuthState } from './auth-state.type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment.prod';
import { AuthRequest } from './auth-request.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.apiBaseUrl

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.getUser(),
    token: this.getToken(),
    iduser: this.getidUser(),
    isAuthenticated: this.verifyToken(this.getToken())
  });

  user = computed(() => this.authState().user);
  token = computed(() => this.authState().token);
  iduser = computed(() => this.authState().iduser);
  isAuthenticated = computed(() => this.authState().isAuthenticated);

  constructor(private http: HttpClient) {
    effect(() => {
      this.setFieldOnStorage(this.token(), "token");
      this.setFieldOnStorage(this.user(), "user");
      this.setFieldOnStorage(this.iduser(), "iduser");

    });
  }

  async updateToken(token: string) {
    const decodedToken: any = jwtDecode(token);
    const user = decodedToken.user;
    const iduser = decodedToken.idUser;
    this.authState.set({
      user: user,
      iduser: iduser,
      token: token,
      isAuthenticated: this.verifyToken(token)
    })
  }

  setFieldOnStorage<T>(value: T, namefield: string) {
    if (value !== null) {
      localStorage.setItem(namefield, `${value}`);
    } else {
      localStorage.removeItem(namefield);
    }
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getUser() {
    return localStorage.getItem("user");
  }

  getidUser() {
    return localStorage.getItem("iduser");
  }

  verifyToken(token: string | null): boolean {
    if (token !== null) {
      try {
        const decodedToken = jwtDecode(token);
        const expiration = decodedToken.exp;
        if (expiration === undefined || Date.now() >= expiration * 1000) {
          return false;
        } else {
          return true;
        }
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getToken());
  }

  logout() {
    this.authState.set({
      user: null,
      token: null,
      iduser: null,
      isAuthenticated: false
    });
  }

  login(loginRequest: AuthRequest) {

    const url = `${this.url}/auth/login`;
    return this.http.post<{ token: string }>(url, loginRequest, this.httpOptions);

  }

}

import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { AuthState } from './auth-state.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

  constructor() {
    effect(() => {
      this.setFieldOnStorage(this.token, "token");
      this.setFieldOnStorage(this.user, "user");
      this.setFieldOnStorage(this.iduser, "iduser");

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
}

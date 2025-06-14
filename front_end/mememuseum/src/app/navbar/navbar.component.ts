import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Darkmode } from './darkmode/darkmode.component';
import { Login } from '../login/login.component';
import { AuthService } from '../_services/auth/auth.service';
import { UserService } from '../_services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Darkmode, Login],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class Navbar {

  isMenuActive = signal(false);
  isProfileMenuActive = signal(false);
  isLogged = signal(false);
  profilePic = signal<string | null>(null);
  nickname = signal<string | null>(null);

  constructor(private authservice: AuthService, private UserService: UserService, private router: Router) { }


  onLogin() {
    this.isLogged.set(this.authservice.isUserAuthenticated());
    this.profilePic.set(this.UserService.getProfilePic());
    this.nickname.set(this.UserService.getNickName());
  }

  stopLoading(event: Event) {
    let target = event.target as HTMLElement;
    target.classList.remove('hidden');
    target.previousElementSibling?.classList.add('hidden');
  }

  ngOnInit() {
    this.isLogged.set(this.authservice.isUserAuthenticated());
    this.profilePic.set(this.UserService.getProfilePic());
    this.nickname.set(this.UserService.getNickName());
  }

  ChangeMenuState() {
    this.isMenuActive.update(value => !value);
  }

  ChangeProfileMenuState() {
    this.isProfileMenuActive.update(value => !value);
  }

  openLogin() {
    let element = document.getElementById("login");
    element?.classList.remove("hidden");
  }

  logout() {

    this.authservice.logout();
    setTimeout(() => {
      this.isLogged.set(this.authservice.isUserAuthenticated());
      this.router.navigate(["/"]);
    }, 100);



  }

}

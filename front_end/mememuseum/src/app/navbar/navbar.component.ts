import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Darkmode } from './darkmode/darkmode.component';
import { Login } from '../login/login.component';
import { AuthService } from '../_services/auth/auth.service';
import { UserService } from '../_services/user/user.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Darkmode, Login],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class Navbar {

  isMenuActive = signal(false);
  isLogged = signal(false);
  profilePic = signal<string | null>(null);

  constructor(private authservice: AuthService, private UserService: UserService) { }

  //TODO sistemare
  onLogin() {
    this.isLogged.set(this.authservice.isUserAuthenticated());
    this.UserService.getProfilePic().subscribe({
      next: (val) => {
        this.profilePic.set(val);
      }
    });
  }

  ngOnInit() {
    this.isLogged.set(this.authservice.isUserAuthenticated());
    this.UserService.getProfilePic().subscribe({
      next: (val) => {
        this.profilePic.set(val);
      }
    })
  }

  ChangeMenuState() {
    this.isMenuActive.update(value => !value);
  }

  openLogin() {
    let element = document.getElementById("login");
    element?.classList.remove("hidden");
  }

}

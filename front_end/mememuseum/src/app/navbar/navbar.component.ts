import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Darkmode } from './darkmode/darkmode.component';
import { Login } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Darkmode, Login],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class Navbar {

  isMenuActive = signal(false);

  ChangeMenuState() {

    this.isMenuActive.update(value => !value);

  }

  openLogin() {
    let element = document.getElementById("login");
    element?.classList.remove("hidden");
  }

}

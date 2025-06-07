import { Component } from '@angular/core';
import { signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class Navbar {

  isMenuActive = signal(false);

  ChangeMenuState() {

    this.isMenuActive.update(value => !value);

  }

}

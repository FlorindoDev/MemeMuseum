import { Component } from '@angular/core';

@Component({
  selector: 'app-darkmode',
  imports: [],
  templateUrl: './darkmode.component.html',
  styleUrl: './darkmode.component.scss'
})
export class Darkmode {

  constructor() {
    let dark = localStorage.getItem("dark");
    if (dark === null) {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  }

  changeMode() {
    let dark = localStorage.getItem("dark");
    if (dark === null) {
      document.body.classList.add("dark");
      localStorage.setItem("dark", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.removeItem("dark");
    }
  }

}

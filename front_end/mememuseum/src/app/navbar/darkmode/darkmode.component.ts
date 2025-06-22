import { Component } from '@angular/core';

@Component({
  selector: 'app-darkmode',
  imports: [],
  templateUrl: './darkmode.component.html',
  styleUrl: './darkmode.component.scss'
})
export class Darkmode {

  constructor() {
    let light = localStorage.getItem("light");
    if (light === null) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  }

  changeMode() {
    let light = localStorage.getItem("light");
    if (light === null) {
      document.body.classList.add("light");
      localStorage.setItem("light", "true");
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.removeItem("light");
    }
  }

}

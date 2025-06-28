import { Component } from '@angular/core';
import { Filters } from '../../filters/filters.component';

@Component({
  selector: 'filterbutton',
  imports: [Filters],
  templateUrl: './filterbutton.component.html',
  styleUrl: './filterbutton.component.scss'
})
export class Filterbutton {

  isClose = true;

  onClose() {
    if (this.isClose) {
      document.getElementById("filter")?.classList.remove("hidden");
      this.isClose = false;
    } else {
      document.getElementById("filter")?.classList.add("hidden");
      this.isClose = true;
    }

  }

}

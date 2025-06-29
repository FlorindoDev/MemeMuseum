import { Component, Input } from '@angular/core';
import { Filters } from '../../filters/filters.component';

@Component({
  selector: 'filterbutton',
  imports: [Filters],
  templateUrl: './filterbutton.component.html',
  styleUrl: './filterbutton.component.scss'
})
export class Filterbutton {

  isClose = false;
  @Input() idfilter = "filter";

  onClose() {
    if (this.isClose) {
      document.getElementById(this.idfilter)?.classList.remove("hidden");
      this.isClose = false;
    } else {
      document.getElementById(this.idfilter)?.classList.add("hidden");
      this.isClose = true;
    }

  }

}

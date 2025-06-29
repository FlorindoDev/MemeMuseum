import { Component, Input } from '@angular/core';
import { Filters } from '../../filters/filters.component';
import { Router } from '@angular/router';

@Component({
  selector: 'filterbutton',
  imports: [Filters],
  templateUrl: './filterbutton.component.html',
  styleUrl: './filterbutton.component.scss'
})
export class Filterbutton {

  isClose = true;
  @Input() idfilter = "filter";

  constructor(private router: Router) { }

  onClose() {
    if (this.isClose) {
      document.getElementById(this.idfilter)?.classList.remove("hidden");
      this.isClose = false;
    } else {
      document.getElementById(this.idfilter)?.classList.add("hidden");
      this.isClose = true;
    }

  }

  get isDaily() {
    return this.router.url === '/home' ? true : false
  }

}

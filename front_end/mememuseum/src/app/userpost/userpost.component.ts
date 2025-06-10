import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'user-post',
  imports: [],
  templateUrl: './userpost.component.html',
  styleUrl: './userpost.component.scss'
})
export class Userpost {

  constructor(private route: Router) { }

  toUserPost(event: Event) {

    const target = event.target as HTMLElement;

    if (target.tagName === 'IMG') {
      return;
    }
    this.route.navigate(['/']);
  }

}

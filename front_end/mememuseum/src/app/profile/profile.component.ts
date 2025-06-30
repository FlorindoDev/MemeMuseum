import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class Profile {

  removePulse(event: Event): void {
    event.stopPropagation();
    (event.currentTarget as HTMLElement).parentElement?.classList.remove('animate-pulse');
  }

}

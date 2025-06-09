import { Component } from '@angular/core';
import { Userpost } from '../userpost/userpost.component';

@Component({
  selector: 'app-homepage',
  imports: [Userpost],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class Homepage {

}

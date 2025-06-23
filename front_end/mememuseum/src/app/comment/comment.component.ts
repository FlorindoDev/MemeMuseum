import { Component, Input } from '@angular/core';
import { comment } from '../_services/comment/comment.type';

@Component({
  selector: 'comment',
  standalone: true,
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class Comment {

  @Input() comment: comment = { content: " " };

}

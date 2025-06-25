import { Component, Input } from '@angular/core';
import { comment } from '../_services/comment/comment.type';
import { UserService } from '../_services/user/user.service';
import { User } from '../_services/user/user.type';
import { environment } from '../environment.prod';
import { VoteBar } from './vote-bar/vote-bar.component';

@Component({
  selector: 'comment',
  standalone: true,
  imports: [VoteBar],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class Comment {

  @Input() comment: comment = { content: " " };
  comment_owner?: User;
  timeDiffFromCreation = environment.timeDiffFromCreation;

  constructor(private user_service: UserService) { }

  ngOnInit() {
    this.fatchUser();

  }

  fatchUser() {
    if (this.comment.UserIdUser) this.user_service.getUserFromId(this.comment.UserIdUser).subscribe({
      next: (user) => {
        if (user.profilePic === null) user.profilePic = environment.noProfilePic;
        this.comment_owner = user;
      }
    });
  }

  getTime() {
    return environment.timeDiffFromCreation(this.comment.createdAt as Date);
  }

}

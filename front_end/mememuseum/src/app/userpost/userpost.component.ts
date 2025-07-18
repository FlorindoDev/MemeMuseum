import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Meme } from '../_services/meme/meme.type';
import { CommonModule } from '@angular/common';
import { numvote } from '../_services/vote/numvote.type';
import { User } from '../_services/user/user.type';
import { UserService } from '../_services/user/user.service';
import { numcomments } from '../_services/comment/numcommets.type';
import { CommentService } from '../_services/comment/comment.service';
import { environment } from '../environment.prod';
import { VoteBar } from './vote-bar/vote-bar.component';
import { ToastrService } from 'ngx-toastr';
import { tag } from '../_services/meme/tag.type';
import { MemeService } from '../_services/meme/meme.service';

@Component({
  selector: 'user-post',
  imports: [CommonModule, VoteBar],
  templateUrl: './userpost.component.html',
  styleUrl: './userpost.component.scss'
})
export class Userpost {

  @Input({ required: true }) meme: Meme = { idMeme: 0, image: "", description: "" };
  @Input() isCard: boolean = true;

  votes: numvote = { upvote: 0, downvote: 0 };
  user: User = { nickName: "", email: "", profilePic: null };
  comments: numcomments = { comment: 0 };
  timeDiffFromCreation = environment.timeDiffFromCreation;
  tags: tag[] = [];

  constructor(
    private route: Router,
    private userservice: UserService,
    private comment_service: CommentService,
    private toastrservice: ToastrService,
    private meme_service: MemeService
  ) { }

  onShare(event: Event) {
    event.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/memes/${this.meme.idMeme}`)
      .then(() => {
        this.toastrservice.success("link salvato con successo negli appunti", "Salvato con successo")
      })
  }

  goToUser(event: Event) {
    event.stopPropagation();
    this.route.navigate([`users/${this.user.idUser}`]);
  }

  toUserPost(event: Event) {

    const target = event.target as HTMLElement;

    if (target.tagName === 'IMG') {
      return;
    }
    this.route.navigate([`memes/${this.meme.idMeme}`]);
  }

  ngOnInit() {
    this.fetchUser();
    this.fetchNumComments();
    this.fetchTags();
  }

  getTime() {
    return environment.timeDiffFromCreation(this.meme.createdAt as Date);
  }

  stopLoading(event: Event) {
    let target = event.target as HTMLElement;
    target.classList.remove('hidden');
    target.previousElementSibling?.classList.add('hidden');
  }


  fetchUser() {
    this.userservice.getUserFromId(this.meme.UserIdUser as number).subscribe({
      next: (value) => {
        if (value.profilePic === null) value.profilePic = environment.noProfilePic;
        this.user = value;
      }
    })
  }

  fetchTags() {
    this.meme_service.getTags({ idmeme: this.meme.idMeme }).subscribe({
      next: (val) => {
        this.tags = val;
      }
    })
  }

  fetchNumComments() {
    this.comment_service.getNumComments({ idmeme: this.meme.idMeme }).subscribe({
      next: (response) => {
        if (response.status === 204) {
          this.comments = { comment: 0 };
          return;
        }

        if (response.body !== null) this.comments = response.body;
      },

      error: (err) => {

      }
    })
  }

}

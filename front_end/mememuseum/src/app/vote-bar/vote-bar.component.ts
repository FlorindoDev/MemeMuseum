
import { Component, Input } from '@angular/core';
import { Meme } from '../_services/meme/meme.type';
import { VoteService } from '../_services/vote/vote.service';
import { numvote } from '../_services/vote/numvote.type';
import { AuthService } from '../_services/auth/auth.service';
import { vote } from '../_services/vote/vote.type';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'vote-bar',
  imports: [],
  templateUrl: './vote-bar.component.html',
  styleUrl: './vote-bar.component.scss'
})
export class VoteBar {


  @Input({ required: true }) meme: Meme = { idMeme: 0, image: "", description: "" };
  votes: numvote = { upvote: 0, downvote: 0 };
  userVote: vote[] | null = null;


  constructor(
    private vote_service: VoteService,
    private auth_service: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.fatchNumVotes();
    this.fatchUserVote();
  }


  fatchNumVotes() {
    this.vote_service.getNumVotes({ idmeme: this.meme.idMeme }).subscribe({
      next: (response) => {
        if (response.status === 204) {
          this.votes = { upvote: 0, downvote: 0 };
          return;
        }
        if (response.body !== null) this.votes = response.body;
      }
    })
  }

  fatchUserVote() {
    if (this.auth_service.isAuthenticated()) {
      this.vote_service.userVote(this.meme.idMeme, Number(this.auth_service.getidUser())).subscribe({
        next: (val) => {
          this.userVote = val;
        }
      })
    }
  }

  switchVote(upvote: boolean) {
    if (upvote) {

      if (this.userVote !== null) this.votes.downvote -= 1;
      this.votes.upvote += 1;

    } else {

      if (this.userVote !== null) this.votes.upvote -= 1;
      this.votes.downvote += 1;

    }
    this.userVote = [{ upVote: upvote }];
  }

  removeVote() {
    if (this.userVote) this.userVote[0].upVote ? this.votes.upvote -= 1 : this.votes.downvote -= 1
    this.userVote = null;
  }

  changeVote(event: Event) {

    if (!this.auth_service.isAuthenticated()) {
      //TODO: Fare che quando clicco si apre il login
    }

    event.stopPropagation(); //evita che quando clicco apre la pagina del meme

    let element = event.currentTarget as HTMLElement;

    if (element.id === "up-active" || element.id === "down-active") {
      this.vote_service.removeVotes(this.meme.idMeme).subscribe({
        next: () => {
          this.removeVote();
        }
      });
    } else {
      let upvote: boolean = element.id === "up" ? true : false;
      this.vote_service.addVotes(this.meme.idMeme, upvote).subscribe({
        next: () => {
          this.switchVote(upvote)
        }
      });

    }
  }

}

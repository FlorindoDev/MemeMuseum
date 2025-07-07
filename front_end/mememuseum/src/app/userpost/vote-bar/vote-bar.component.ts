import { Component, Input } from '@angular/core';
import { Meme } from '../../_services/meme/meme.type';
import { VoteService } from '../../_services/vote/vote.service';
import { numvote } from '../../_services/vote/numvote.type';
import { AuthService } from '../../_services/auth/auth.service';
import { vote } from '../../_services/vote/vote.type';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'vote-bar',
  imports: [],
  templateUrl: './vote-bar.component.html',
  styleUrl: './vote-bar.component.scss'
})
export class VoteBar {


  @Input({ required: true }) meme: Meme = { idMeme: 0, image: "", description: "" };

  numvotes: numvote = { upvote: 0, downvote: 0 };
  vote: vote[] | null = null;



  constructor(
    private vote_service: VoteService,
    private auth_service: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.fatchNumVotes();
    this.fatchVote();
  }


  fatchNumVotes() {
    this.vote_service.getNumVotes({ idmeme: this.meme.idMeme }).subscribe({
      next: (response) => {
        if (response.status === 204) {
          this.numvotes = { upvote: 0, downvote: 0 };
          return;
        }
        if (response.body !== null) this.numvotes = response.body;
      }
    })
  }

  fatchVote() {
    if (this.auth_service.isAuthenticated()) {
      this.vote_service.userVotes({ idmeme: this.meme.idMeme, iduser: this.auth_service.getidUser() as string }).subscribe({
        next: (val) => {
          this.vote = val;
        }
      })
    }
  }

  switchVote(upvote: boolean) {
    if (upvote) {

      if (this.vote !== null) this.numvotes.downvote -= 1;
      this.numvotes.upvote += 1;

    } else {

      if (this.vote !== null) this.numvotes.upvote -= 1;
      this.numvotes.downvote += 1;

    }
    this.vote = [{ upVote: upvote }];
  }

  removeVote() {
    if (this.vote) this.vote[0].upVote ? this.numvotes.upvote -= 1 : this.numvotes.downvote -= 1
    this.vote = null;
  }

  changeVote(event: Event) {
    event.stopPropagation(); //evita che quando clicco apre la pagina del meme

    if (!this.auth_service.isAuthenticated()) {
      this.toastr.error('Non sei autetificato', 'Necessario Login!');
      return;
    }

    let element = event.currentTarget as HTMLElement;

    if (element.id === "up-active" || element.id === "down-active") {
      this.vote_service.removeVotes({ idmeme: this.meme.idMeme }).subscribe({
        next: () => {
          this.removeVote();
        }
      });
    } else {
      let upvote: boolean = element.id === "up" ? true : false;
      this.vote_service.addVotes({ idmeme: this.meme.idMeme }, upvote).subscribe({
        next: () => {
          this.switchVote(upvote);
        }
      });

    }
  }

}

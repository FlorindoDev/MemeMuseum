import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Meme } from '../_services/meme/meme.type';
import { CommonModule } from '@angular/common';
import { VoteService } from '../_services/vote/vote.service';
import { memevote } from '../_services/vote/memevote.type';

@Component({
  selector: 'user-post',
  imports: [CommonModule],
  templateUrl: './userpost.component.html',
  styleUrl: './userpost.component.scss'
})
export class Userpost {

  @Input({ required: true }) meme: Meme = { idMeme: 0, image: "", description: "" };
  votes: memevote = { upvote: 0, downvote: 0 }

  constructor(private route: Router, private voteservice: VoteService) { }

  //TODO: creare la pagina al meme
  toUserPost(event: Event) {

    const target = event.target as HTMLElement;

    if (target.tagName === 'IMG') {
      return;
    }
    this.route.navigate([`memes/${this.meme.idMeme}`]);
  }

  ngOnInit() {
    this.fatchVotes();
  }

  fatchVotes() {


    this.voteservice.getVotes({ idmeme: this.meme.idMeme, count: true }).subscribe({
      next: (value) => {
        this.votes = value;
      },
    })
  }

}

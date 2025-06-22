import { Component } from '@angular/core';
import { Userpost } from '../userpost/userpost.component';
import { MemeService } from '../_services/meme/meme.service';
import { Meme } from '../_services/meme/meme.type';
import { LoadingScreen } from '../loading-screen/loading-screen.component';
import { NextPage } from '../next-page/next-page.component';

@Component({
  selector: 'app-homepage',
  imports: [Userpost, LoadingScreen, NextPage],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class Homepage {

  memes: Meme[] = [];

  constructor(public memeService: MemeService) {

  }

  ngOnInit() {
    this.fetchMeme();
  }

  fetchMeme() {

    this.memeService.getMeme().subscribe({
      next: (data) => {
        this.memes = data;
      },
      error: (err) => { }
    });
  }

  onNewMemes(new_memes: Meme[]) {
    if (new_memes != null) {
      new_memes.map((val) => {
        this.memes.push(val);
      });
    }


  }

}

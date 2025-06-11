import { Component, inject } from '@angular/core';
import { Userpost } from '../userpost/userpost.component';
import { MemeService } from '../_services/meme/meme.service';
import { Meme } from '../_services/meme/meme.type';

@Component({
  selector: 'app-homepage',
  imports: [Userpost],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class Homepage {

  memes: Meme[] = [];

  constructor(private memeService: MemeService) {

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

}

import { Component } from '@angular/core';
import { Userpost } from '../userpost/userpost.component';
import { MemeService } from '../_services/meme/meme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meme } from '../_services/meme/meme.type';
import { LoadingScreen } from '../loading-screen/loading-screen.component';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Comment } from '../comment/comment.component';
import { CommentService } from '../_services/comment/comment.service';
import { comment } from '../_services/comment/comment.type';


@Component({
  selector: 'meme-page',
  imports: [Userpost, LoadingScreen, ReactiveFormsModule, Comment],
  templateUrl: './meme-page.html',
  styleUrl: './meme-page.scss'
})
export class MemePage {

  memeId: string | null = "";
  meme: Meme | null = null;
  comments: comment[] = [];

  constructor(
    private meme_service: MemeService,
    private route: ActivatedRoute,
    private toastr_service: ToastrService,
    private router: Router,
    private comment_service: CommentService
  ) { }

  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.memeId = this.route.snapshot.paramMap.get('id');
    this.fetchMeme();
  }

  fetchMeme() {
    this.meme_service.getMemeFromId(Number(this.memeId)).subscribe({
      next: (val) => {
        this.meme = val;
        if (val === null) {
          this.toastr_service.warning("Tra poco sarai reindirizzato alla home", "Meme non esiste!!");
          setTimeout(() => {
            this.router.navigate(["/"]);
          }, 5000);
        } else {
          this.fetchComments();
        }
      }
    });
  }

  fetchComments() {
    this.comment_service.getComment({ idmeme: this.meme?.idMeme, orderby: "upvote,ASC" }).subscribe({
      next: (val) => {
        this.comments = val;
      }
    })
  }

}

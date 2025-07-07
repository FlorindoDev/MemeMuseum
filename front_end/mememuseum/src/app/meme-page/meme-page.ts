import { Component, NgModule } from '@angular/core';
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
import { NextPage } from '../next-page/next-page.component';
import { AuthService } from '../_services/auth/auth.service';
import { Filter } from '../_services/comment/filter.type';
import { FilterService } from '../_services/filter/filter.service';


@Component({
  selector: 'meme-page',
  imports: [Userpost, LoadingScreen, ReactiveFormsModule, Comment, NextPage],
  templateUrl: './meme-page.html',
  styleUrl: './meme-page.scss'
})
export class MemePage {

  memeId: string | null = "";
  meme: Meme | null = null;
  comments: comment[] = [];
  isSubmitted: boolean = false;
  filter?: Filter;

  constructor(
    private meme_service: MemeService,
    private route: ActivatedRoute,
    private toastr_service: ToastrService,
    private router: Router,
    protected comment_service: CommentService,
    private auth_service: AuthService,
    private toastr: ToastrService,
    private filter_service: FilterService<comment, Filter>
  ) { }

  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.memeId = this.route.snapshot.paramMap.get('id');
    if (this.memeId !== null && !isNaN(Number(this.memeId))) {
      this.filter = { idmeme: Number(this.memeId), orderby: "upvote,DESC" }
      this.filter_service.updateFilter(this.filter);
      this.fetchMeme();
    } else {
      this.memeNotExsists();
    }

  }

  addRedRing(element: HTMLElement, error: unknown | boolean): void {
    if (error) {
      element.classList.add("ring-2");
      element.classList.add("ring-red-400");
    } else {
      element.classList.remove("ring-2");
      element.classList.remove("ring-red-400");
    }
  }

  startLoading() {
    document.getElementById("text-commenta")?.classList.add("hidden");
    document.getElementById("loading-comment")?.classList.remove("hidden");
  }

  stopLoading() {
    document.getElementById("text-commenta")?.classList.remove("hidden");
    document.getElementById("loading-comment")?.classList.add("hidden");
  }

  handleComment() {

    if (!this.auth_service.isAuthenticated()) {
      this.toastr.error('Non sei autetificato', 'Necessario Login!')
      return;
    }

    this.startLoading();
    this.isSubmitted = true;
    let element = document.querySelector("#textarea-comment") as HTMLElement

    if (this.commentForm.invalid) {
      this.stopLoading();
      this.addRedRing(element, this.isFieldInError(element));
    } else {
      this.comment_service.saveComment({ content: this.commentForm.value.comment as string, MemeIdMeme: this.meme?.idMeme }).subscribe({
        next: () => {
          window.location.reload();
          this.toastr_service.success('Commento aggiunto con successo', 'Successo!');
          this.stopLoading();
        },

        error: () => {
          this.stopLoading();
        }
      })
    }
  }

  hendleTyping(event?: Event) {
    let element = event?.target as HTMLElement;
    if (this.isSubmitted) {
      this.addRedRing(element, this.isFieldInError(element));
    }
  }

  isFieldInError(element: HTMLElement) {
    let attr: string = element.getAttribute("formControlName") as string;
    const control = this.commentForm.get(attr);
    return control?.errors !== null;

  }

  memeNotExsists() {
    this.toastr_service.warning("Tra poco sarai reindirizzato alla home", "Meme non esiste!!");
    setTimeout(() => {
      this.router.navigate(["/"]);
    }, 5000);
  }

  fetchMeme() {
    this.meme_service.getMemeFromId(Number(this.memeId)).subscribe({
      next: (val) => {
        this.meme = val;
        if (val === null) {
          this.memeNotExsists();
        } else {
          this.fetchComments();
        }
      }
    });
  }

  fetchComments() {
    this.comment_service.getComment({ idmeme: this.meme?.idMeme, orderby: "upvote,DESC" }).subscribe({
      next: (val) => {
        this.comments = val;
      }
    })
  }

  onNewComments(new_comments: comment[]) {
    if (new_comments != null) {
      new_comments.map((val) => {
        this.comments.push(val);
      });
    }
  }

}

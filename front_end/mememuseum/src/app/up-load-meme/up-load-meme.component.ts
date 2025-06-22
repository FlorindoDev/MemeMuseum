import { Component } from '@angular/core';
import { DragAndDrop } from '../drag-and-drop/drag-and-drop.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MemeService } from '../_services/meme/meme.service';
import { tag } from '../_services/meme/tag.type';
import { Meme } from '../_services/meme/meme.type';
import { Router } from '@angular/router';

@Component({
  selector: 'up-load-meme',
  imports: [DragAndDrop, ReactiveFormsModule],
  templateUrl: './up-load-meme.component.html',
  styleUrl: './up-load-meme.component.scss'
})
export class UpLoadMeme {

  constructor(private toastr: ToastrService, private meme_service: MemeService, private router: Router) { }

  tags: Array<string> = [];
  file?: File;
  tagsToSend: tag[] = [];

  upLoadForm = new FormGroup({
    tags: new FormControl('', [Validators.minLength(3), Validators.maxLength(15), Validators.required]),
    descrizione: new FormControl('')
  });

  addRedRing(element: HTMLElement, error: unknown | boolean): void {
    if (error) {
      element.classList.add("ring-2");
      element.classList.add("ring-red-400");
    } else {
      element.classList.remove("ring-2");
      element.classList.remove("ring-red-400");
    }
  }

  onEnter(event: KeyboardEvent) {

    this.addRedRing(event.target as HTMLElement, this.upLoadForm.invalid);

    if (event.code === "Enter") {

      if (this.upLoadForm.controls.tags.errors) {
        if (this.upLoadForm.controls.tags.errors['required']) {
          this.toastr.error("Insersici qualcosa", "Tag vuoto");

        }
        return;
      }

      if (this.tags.length === 5) {
        this.addRedRing(event.target as HTMLElement, this.upLoadForm.invalid);
        this.toastr.error("Massimo 5 tags per meme", "Massimo raggiunto");
      }
      else if (this.tags.find((val) => this.upLoadForm.value.tags === val)) {
        this.toastr.error("Qeusto tag è gia presente", "Tag già inserito!");
      } else {
        this.tags.push(this.upLoadForm.value.tags as string);
        this.upLoadForm.get('tags')?.setValue('');
      }

    }

  }

  removeTag(event: Event) {
    this.tags = this.tags.filter((val) => !((event.currentTarget as HTMLElement).parentElement?.textContent?.trim() === val));
  }

  startLoading() {
    document.getElementById("text-crea")?.classList.add("hidden");
    document.getElementById("loading-icon")?.classList.remove("hidden");
  }

  stopLoading() {
    document.getElementById("text-crea")?.classList.remove("hidden");
    document.getElementById("loading-icon")?.classList.add("hidden");
  }

  saveFile(loadedfile: File) {
    this.file = loadedfile;
  }

  prepareTags() {
    this.tags.map((val) => {
      this.tagsToSend.push({ name: val })
    });
  }

  saveTags(meme: Meme) {
    this.prepareTags();
    this.meme_service.addTags(meme.idMeme, this.tagsToSend).subscribe({
      next: () => {
        this.toastr.success("Successo caricamento tags!");
      },
      error: () => {
        this.stopLoading();
      }
    });
  }

  handleUpLoad() {
    this.startLoading();
    this.meme_service.saveMeme({ image: this.file as File, description: this.upLoadForm.value.descrizione }).subscribe({
      next: (meme: Meme) => {

        this.toastr.success("Successo caricamento Meme!");
        this.saveTags(meme);
        this.router.navigate(["/"]);
      },
      error: () => {
        this.stopLoading();
      }

    })


  }

}

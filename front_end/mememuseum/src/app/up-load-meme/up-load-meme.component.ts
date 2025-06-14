import { Component } from '@angular/core';
import { DragAndDrop } from '../drag-and-drop/drag-and-drop.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoadingScreen } from '../loading-screeen/loading-screen.component';

@Component({
  selector: 'up-load-meme',
  imports: [DragAndDrop, ReactiveFormsModule, LoadingScreen],
  templateUrl: './up-load-meme.component.html',
  styleUrl: './up-load-meme.component.scss'
})
export class UpLoadMeme {

  constructor(private ToastrService: ToastrService) { }

  tags: Array<string> = [];

  upLoadForm = new FormGroup({
    tags: new FormControl('', [Validators.minLength(3), Validators.maxLength(10), Validators.required]),
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

    if (this.upLoadForm.controls.tags.errors) {
      if (this.upLoadForm.controls.tags.errors['required']) {
        this.ToastrService.error("Insersici qualcosa", "Tag vuoto");
        return;
      }
    }

    if (event.code === "Enter") {
      if (this.tags.length === 5) {
        this.addRedRing(event.target as HTMLElement, this.upLoadForm.invalid);
        this.ToastrService.error("Massimo 5 tags per meme", "Massimo raggiunto");
      }
      else if (this.tags.find((val) => this.upLoadForm.value.tags === val)) {
        this.ToastrService.error("Qeusto tag è gia presente", "Tag già inserito!");
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
    document.getElementById("text-accedi")?.classList.add("hidden");
    document.getElementById("loading")?.classList.remove("hidden");
  }

  stopLoading() {
    document.getElementById("text-accedi")?.classList.remove("hidden");
    document.getElementById("loading")?.classList.add("hidden");
  }

  handleUpLoad() {

  }

}

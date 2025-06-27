import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { tag } from '../_services/meme/tag.type';
import { ToastrService } from 'ngx-toastr';
import { Meme } from '../_services/meme/meme.type';
import { MemeService } from '../_services/meme/meme.service';
import { Filter } from '../_services/meme/filter.type';

@Component({
  selector: 'filters',
  imports: [ReactiveFormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class Filters {

  constructor(private toastr: ToastrService, private meme_service: MemeService) { }

  tagsToSend?: string;
  tags: Array<string> = [];
  @Output() filterd_meme = new EventEmitter<Meme[]>();
  @Output() filter = new EventEmitter<Filter>();

  filtersForm = new FormGroup({
    username: new FormControl('', []),  // qui puoi mettere Validators se vuoi
    tags: new FormControl('', [Validators.minLength(3), Validators.maxLength(15), Validators.required]),
    upvotes: new FormControl(false),     // checkbox
    downvotes: new FormControl(false),   // checkbox
  });

  handleTyping(event: Event) { }

  prepareTags() {
    this.tagsToSend = this.tags.join(',');
  }

  applyFilters() {
    console.log("adawd");


    this.prepareTags();
    let filter: Filter = {}
    if (this.filtersForm.value.username) filter.username = this.filtersForm.value.username as string;
    if (this.tags) filter.nametags = this.tagsToSend;
    this.meme_service.getMeme(filter).subscribe({
      next: (val: Meme[]) => {
        this.filterd_meme.emit(val);
        this.filter.emit(filter);
      }
    })


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

  onEnter(event: KeyboardEvent) {

    this.addRedRing(event.target as HTMLElement, this.filtersForm.invalid);

    if (event.code === "Enter") {

      if (this.filtersForm.controls.tags.errors) {
        if (this.filtersForm.controls.tags.errors['required']) {
          this.toastr.error("Insersici qualcosa", "Tag vuoto");

        }
        return;
      }

      if (this.tags.length === 10) {
        this.addRedRing(event.target as HTMLElement, this.filtersForm.invalid);
        this.toastr.error("Massimo 10 tags per ricerca", "Massimo raggiunto");
      }
      else if (this.tags.find((val) => this.filtersForm.value.tags === val)) {
        this.toastr.error("Qeusto tag è gia presente", "Tag già inserito!");
      } else {
        this.addRedRing(event.target as HTMLElement, this.filtersForm.invalid);
        this.tags.push(this.filtersForm.value.tags as string);
        this.filtersForm.get('tags')?.setValue('');
      }

    }

  }

  removeTag(event: Event) {
    this.tags = this.tags.filter((val) => !((event.currentTarget as HTMLElement).parentElement?.textContent?.trim() === val));
  }

}

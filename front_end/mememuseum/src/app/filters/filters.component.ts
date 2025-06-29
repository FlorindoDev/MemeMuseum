import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Meme } from '../_services/meme/meme.type';
import { MemeService } from '../_services/meme/meme.service';
import { Filter } from '../_services/meme/filter.type';
import { FilterService } from '../_services/filter/filter.service';
import { DailymemeService } from '../_services/dailymeme/dailymeme.service';

@Component({
  selector: 'filters',
  imports: [ReactiveFormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class Filters {

  constructor(
    private toastr: ToastrService,
    private meme_service: MemeService,
    private filter_service: FilterService<Meme, Filter>,
    private dailymeme: DailymemeService
  ) { }

  tagsToSend?: string;
  tags: Array<string> = [];
  @Input() isDaily: boolean = false;

  filtersForm = new FormGroup({
    username: new FormControl('', []),  // qui puoi mettere Validators se vuoi
    tags: new FormControl('', [Validators.minLength(3), Validators.maxLength(15), Validators.required]),
    sort_vote: new FormControl('upvote', [])
  });

  handleTyping(event: Event) { }

  prepareTags() {
    this.tagsToSend = this.tags.join(',');
  }

  applyFilters() {

    let sort_element = this.filtersForm.value.sort_vote

    this.prepareTags();

    let filter: Filter = {}

    if (this.filtersForm.value.username) filter.username = this.filtersForm.value.username as string;
    if (this.tags) filter.nametags = this.tagsToSend;

    if (sort_element && sort_element !== "niente") {
      if (sort_element === "ASC" || sort_element === "DESC") {
        filter.orderbydate = `${sort_element}`
      } else {
        filter.orderby = `${sort_element},DESC`
      }

    }

    this.filter_service.updateFilter(filter);
    if (!this.isDaily) {

      this.meme_service.getMeme(filter).subscribe({
        next: (val: Meme[]) => {
          this.filter_service.updateFilteredResource(val);
        }
      });
    } else {
      this.dailymeme.getMemeDailyMeme(filter).subscribe({
        next: (val: Meme[]) => {
          this.filter_service.updateFilteredResource(val);
        }
      });
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

import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { PagedResources } from '../_services/interfaces/PagedResources.interfaces';
import { FilterService } from '../_services/filter/filter.service';

@Component({
  selector: 'next-page',
  imports: [],
  templateUrl: './next-page.component.html',
  styleUrl: './next-page.component.scss'
})
export class NextPage<C, T extends object> {

  @Input() service!: PagedResources<C, T>
  @Output() resource: EventEmitter<C[]> = new EventEmitter<C[]>();
  @Input() page: number = 1;
  @Input() filter?: T;

  constructor(private filter_service: FilterService<C, T>) { }

  ngOnInit() {
    this.filter_service.filter$.subscribe((val: T) => {
      this.filter = val;
    });
  }

  loadNext() {
    this.service.getNextPage(this.page++, this.filter).subscribe({
      next: (val) => {
        this.resource.emit(val);
      }
    });
  }

  @HostListener('window:scroll', []) // esegue questa funzione ogni volta che l’utente scrolla la finestra (window)
  onWindowScroll() {
    const threshold = 1;
    const position = window.innerHeight + window.scrollY; // window.innerHeight grandezza viewport  window.scrollY quanto ho scrollato
    const height = document.body.offsetHeight;  //Altezza totale della pagina

    if (height - position < threshold) {
      this.loadNext();

    }
  }

}




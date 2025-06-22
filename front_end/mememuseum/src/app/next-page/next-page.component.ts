import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { PagedResources } from '../_services/interfaces/PagedResources.interfaces';
//import { MemeService } from '../_services/meme/meme.service';

@Component({
  selector: 'next-page',
  imports: [],
  templateUrl: './next-page.component.html',
  styleUrl: './next-page.component.scss'
})
export class NextPage<C> {

  @Input() service!: PagedResources<C>
  @Output() resource: EventEmitter<C[]> = new EventEmitter<C[]>();
  @Input() page: number = 1;


  loadNext() {
    this.service.getNextPage(this.page++).subscribe({
      next: (val) => {
        this.resource.emit(val);
      }
    });
  }

  @HostListener('window:scroll', []) // esegue questa funzione ogni volta che l’utente scrolla la finestra (window)
  onWindowScroll() {
    const threshold = 300;
    const position = window.innerHeight + window.scrollY; // window.innerHeight grandezza viewport  window.scrollY quanto ho scrollato
    const height = document.body.offsetHeight;  //Altezza totale della pagina

    if (height - position < threshold) {
      this.loadNext();

    }
  }

}




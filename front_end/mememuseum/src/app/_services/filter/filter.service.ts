import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService<T, C> {


  private filteredSubject = new BehaviorSubject<T[]>([]);                 //serve per un stream di dati nel tempo
  filteredResource$: Observable<T[]> = this.filteredSubject.asObservable();  //$ indca accessbile ovunque, asObservable() impedisce di chiamare next con subscribe

  private filterSubject = new BehaviorSubject<C>({} as C);
  filter$: Observable<C> = this.filterSubject.asObservable();


  updateFilteredResource(resources: T[]) {
    this.filteredSubject.next(resources);
  }

  updateFilter(filter: C) {
    this.filterSubject.next(filter);
  }



}

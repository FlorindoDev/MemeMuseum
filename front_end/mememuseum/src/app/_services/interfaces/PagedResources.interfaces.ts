import { Observable } from "rxjs";

export interface PagedResources<T, F> {

    getNextPage(page: number, filter?: F): Observable<T[]>;

}
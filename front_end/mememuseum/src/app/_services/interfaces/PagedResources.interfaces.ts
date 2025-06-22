import { Observable } from "rxjs";

export interface PagedResources<T> {

    getNextPage(page: number): Observable<T[]>;

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment.prod';
import { Filter } from './filter.type';
import { comment } from './comment.type';
import { PagedResources } from '../interfaces/PagedResources.interfaces';
import { Observable } from 'rxjs';
import { numcomments } from './numcommets.type';

@Injectable({
  providedIn: 'root'
})
export class CommentService implements PagedResources<comment, Filter> {

  url = environment.apiBaseUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(private http: HttpClient) {
  }

  private createFilterForGetComments(filter: Filter, url: string): string {

    url = `${url}?`

    if (filter.count) {
      url = `${url}count=${filter.count}&`
    }

    if (filter.idmeme) {
      url = `${url}idmeme=${filter.idmeme}&`
    }

    if (filter.iduser) {
      url = `${url}iduser=${filter.iduser}&`
    }

    if (filter.orderby) {
      url = `${url}orderby=${filter.orderby}&`
    }

    return url;
  }

  getNumComments(filter: Filter = {}) {
    filter.count = true;
    let url: string = this.createFilterForGetComments(filter, `/comments`);
    return this.http.get<numcomments>(`${this.url}${url}`, { ...this.httpOptions, observe: 'response' }); //"..." è il spread inserisce le proprità di un oggetto in un altro
  }

  saveComment(comment: comment) {
    let url: string = `/comments?idmeme=${comment.MemeIdMeme}`;
    return this.http.post(`${this.url}${url}`, comment, this.httpOptions); //"..." è il spread inserisce le proprità di un oggetto in un altro
  }

  getComment(filter: Filter = {}) {
    let url: string = this.createFilterForGetComments(filter, `/comments`);
    return this.http.get<comment[]>(`${this.url}${url}`, this.httpOptions); //"..." è il spread inserisce le proprità di un oggetto in un altro
  }

  getNextPage(page: number, filter: Filter = {}): Observable<comment[]> {
    let url: string = this.createFilterForGetComments(filter, `/comments`);
    url = `${url}page=${page}`;
    return this.http.get<comment[]>(`${this.url}${url}`, this.httpOptions);

  }

}
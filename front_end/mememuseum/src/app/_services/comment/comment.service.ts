import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment.prod';
import { numcomments } from './numcommets.type';
import { Filter } from './filter.type';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  url = environment.apiBaseUrl

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private createFilterForGetVote(filter: Filter, url: string): string {

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

    return url;
  }

  getNumComment(filter: Filter = {}) {
    filter.count = true;
    let url: string = this.createFilterForGetVote(filter, `/comments`);
    return this.http.get<numcomments>(`${this.url}${url}`, { ...this.httpOptions, observe: 'response' }); //"..." è il spread inserisce le proprità di un oggetto in un altro
  }

}
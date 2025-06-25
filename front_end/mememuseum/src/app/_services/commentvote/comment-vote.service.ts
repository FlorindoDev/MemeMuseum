import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment.prod';
import { Observable } from 'rxjs';
import { Filter } from './filter.type';
import { numvote } from './numvote.type';
import { vote } from './vote.type';

@Injectable({
  providedIn: 'root'
})
export class CommentVoteService {

  url = environment.apiBaseUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private createFilterForGetVote(filter: Filter, url: string): string {

    url = `${url}/${filter.idcomment}/comments-votes?`;

    if (filter.count) url = `${url}count=${filter.count}&`;
    if (filter.iduser) url = `${url}iduser=${filter.iduser}&`;

    return url;
  }


  getNumVotes(filter: Filter) {

    filter.count = true;
    let url: string = this.createFilterForGetVote(filter, `/comments`);
    return this.http.get<numvote>(`${this.url}${url}`, { ...this.httpOptions, observe: 'response' }); //... è il spread inserisce le proprità di un oggetto in un altro
  }


  addVotes(filter: Filter, upvote: boolean): Observable<any> {

    let url: string = this.createFilterForGetVote(filter, `/comments`);
    return this.http.post(`${this.url}${url}`, { upVote: upvote }, this.httpOptions);
  }

  removeVotes(filter: Filter): Observable<any> {

    let url: string = this.createFilterForGetVote(filter, `/comments`);
    return this.http.delete(`${this.url}${url}`);
  }


  userVotes(filter: Filter): Observable<vote[]> {

    let url: string = this.createFilterForGetVote(filter, `/comments`);
    return this.http.get<vote[]>(`${this.url}${url}`, this.httpOptions);
  }


}

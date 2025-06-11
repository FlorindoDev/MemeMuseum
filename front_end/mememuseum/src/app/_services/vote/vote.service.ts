import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment.prod';
import { memevote } from './memevote.type';
import { Observable } from 'rxjs';
import { Filter } from './filter.type';


@Injectable({
  providedIn: 'root'
})
export class VoteService {

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

  getVotes(filter: Filter = {}): Observable<memevote> {

    let url: string = this.createFilterForGetVote(filter, `/votes`);
    return this.http.get<memevote>(`${this.url}${url}`, this.httpOptions);
  }

  /*
  addVotes(idmeme: number, upvote: boolean): Observable<memevote> {

    let url: string = `/votes?count=true&idmeme=${idmeme}`;
    return this.http.get<memevote>(`${this.url}${url}`, this.httpOptions);
  }*/

}

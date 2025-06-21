import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment.prod';
import { numvote } from './numvote.type';
import { Observable } from 'rxjs';
import { Filter } from './filter.type';
import { vote } from './vote.type';

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

  getNumVotes(filter: Filter = {}) {

    filter.count = true;
    let url: string = this.createFilterForGetVote(filter, `/votes`);
    return this.http.get<numvote>(`${this.url}${url}`, { ...this.httpOptions, observe: 'response' }); //... è il spread inserisce le proprità di un oggetto in un altro
  }


  addVotes(idmeme: number, upvote: boolean): Observable<any> {

    let url: string = `/votes?idmeme=${idmeme}`;
    return this.http.post(`${this.url}${url}`, { upVote: upvote }, this.httpOptions);
  }

  removeVotes(idmeme: number): Observable<any> {

    let url: string = `/votes?idmeme=${idmeme}`;
    return this.http.delete(`${this.url}${url}`);
  }


  userVote(idmeme: number, iduser: number): Observable<vote[]> {

    let url: string = `/votes?idmeme=${idmeme}&iduser=${iduser}`;
    return this.http.get<vote[]>(`${this.url}${url}`, this.httpOptions);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meme } from '../meme/meme.type';
import { Filter } from '../meme/filter.type';
import { environment } from '../../environment.prod';
import { PagedResources } from '../interfaces/PagedResources.interfaces';

@Injectable({
  providedIn: 'root'
})
export class DailymemeService implements PagedResources<Meme, Filter> {

  url: string = environment.apiBaseUrl

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  httpOptionsMidia = {
    headers: new HttpHeaders()
  };

  constructor(private http: HttpClient) { }

  private createFilterGetMemes(filter: Filter = {}, url: string): string {

    url = `${url}?`
    if (filter.iduser) url = `${url}iduser=${filter.iduser}&`;
    if (filter.nametags) url = `${url}nametags=${filter.nametags}&`;
    if (filter.username) url = `${url}username=${filter.username}&`;
    if (filter.orderby) url = `${url}orderby=${filter.orderby}&`;
    if (filter.orderbydate) url = `${url}orderbydate=${filter.orderbydate}&`;

    return url;
  }

  getNextPage(page: number, filter: Filter = {}): Observable<Meme[]> {
    let url = this.createFilterGetMemes(filter, "/memes/fetchDailyMeme");
    url = `${url}page=${page}`;
    return this.http.get<Meme[]>(`${this.url}${url}`, this.httpOptions);

  }

  getMemeDailyMeme(filter: Filter = {}): Observable<Meme[]> {
    let url = this.createFilterGetMemes(filter, "/memes/fetchDailyMeme");
    return this.http.get<Meme[]>(`${this.url}${url}`, this.httpOptions);
  }

}

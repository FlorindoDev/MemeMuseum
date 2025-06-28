import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meme } from './meme.type';
import { Filter } from './filter.type';
import { environment } from '../../environment.prod';
import { tag } from './tag.type';
import { PagedResources } from '../interfaces/PagedResources.interfaces';

@Injectable({
  providedIn: 'root'
})
export class MemeService implements PagedResources<Meme, Filter> {

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
    if (filter.idmeme) {
      url = `${url}/${filter.idmeme}`;
    } else {
      url = `${url}?`
      if (filter.iduser) url = `${url}iduser=${filter.iduser}&`;
      if (filter.nametags) url = `${url}nametags=${filter.nametags}&`;
      if (filter.username) url = `${url}username=${filter.username}&`;
      if (filter.orderby) url = `${url}orderby=${filter.orderby}&`;
      if (filter.orderbydate) url = `${url}orderbydate=${filter.orderbydate}&`;
    }
    return url;
  }

  getMeme(filter: Filter = {}): Observable<Meme[]> {
    let url = this.createFilterGetMemes(filter, "/memes");
    return this.http.get<Meme[]>(`${this.url}${url}`, this.httpOptions);
  }

  getMemeFromId(idmeme: number): Observable<Meme> {
    let url = `/memes/${idmeme}`;
    return this.http.get<Meme>(`${this.url}${url}`, this.httpOptions);
  }

  saveMeme(body: { image: File, description?: string | null }): Observable<Meme> {
    let url = "/memes";

    const formData = new FormData();
    formData.append('image', body.image);
    if (typeof body.description === 'string') {
      formData.append('description', body.description);
    }

    return this.http.post<Meme>(`${this.url}${url}`, formData, this.httpOptionsMidia);
  }

  addTags(idmeme: number, tags: tag[]): Observable<tag[]> {
    let url = `/memes/${idmeme}/tags`;
    return this.http.post<tag[]>(`${this.url}${url}`, tags, this.httpOptions);
  }

  getTags(filter: Filter): Observable<tag[]> {
    let url = this.createFilterGetMemes(filter, "/memes");
    return this.http.get<tag[]>(`${this.url}${url}/tags`, this.httpOptions);
  }

  getNextPage(page: number, filter: Filter = {}): Observable<Meme[]> {
    let url = this.createFilterGetMemes(filter, "/memes");
    url = `${url}page=${page}`;
    return this.http.get<Meme[]>(`${this.url}${url}`, this.httpOptions);

  }


}

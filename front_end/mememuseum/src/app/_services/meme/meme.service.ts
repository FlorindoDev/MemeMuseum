import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meme } from './meme.type';
import { Filter } from './filter.type';
import { environment } from '../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MemeService {

  url = environment.apiBaseUrl

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private createFilterGetMemes(filter: Filter = {}, url: string): string {
    if (filter.idmeme) {
      url = `${url}/${filter.idmeme}`;
    } else {
      url = `${url}?`
      if (filter.iduser) url = `iduser=${filter.iduser}&`;
      if (filter.nametags) url = `$iduser=${filter.nametags}&`;
    }
    return url;
  }

  getMeme(filter: Filter = {}): Observable<Meme[]> {

    let url = this.createFilterGetMemes(filter, "/memes");
    return this.http.get<Meme[]>(`${this.url}${url}`, this.httpOptions);
  }


}

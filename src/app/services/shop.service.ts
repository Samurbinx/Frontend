import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IllustrationModel } from '../models/illustration.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private URL_API = 'http://localhost:8080/illustration';

  constructor(private _http: HttpClient) { }

  getAllIllustration(): Observable<IllustrationModel[]> {
    return this._http.get<IllustrationModel[]>(`${this.URL_API}/`, { responseType: 'json' });
  }

  // getIllustrationById(id: string): Observable<IllustrationModel> {
  //   return this._http.get<IllustrationModel>(`${this.URL_API}/${id}`, { responseType: 'json' });
  // }
}

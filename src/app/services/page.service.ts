import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageModel } from '../models/page.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  // private URL_API = 'http://localhost:8080/page';
  private URL_API = `${environment.apiUrl}/page`;

  constructor(private _http: HttpClient) { }

  getAllPages(id: number): Observable<PageModel[]> {
    return this._http.get<PageModel[]>(`${this.URL_API}/`, { responseType: 'json' });
  }

  getHomePage(): Observable<PageModel> {
    return this._http.get<PageModel>(`${this.URL_API}/1`, { responseType: 'json' });
  } 

  getContactPage(): Observable<PageModel> {
    return this._http.get<PageModel>(`${this.URL_API}/2`, { responseType: 'json' });
  } 

  getAboutMePage(): Observable<PageModel> {
    return this._http.get<PageModel>(`${this.URL_API}/3`, { responseType: 'json' });
  } 
}

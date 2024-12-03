import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PieceModel } from '../models/piece.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PieceService {
  // private URL_API = 'http://localhost:8080/piece';
  private URL_API = `${environment.apiUrl}/piece`;

  constructor(private _http: HttpClient) { }

  getAllPieceImages(id: number): Observable<string[]> {
    return this._http.get<string[]>(`${this.URL_API}/${id}/images`, { responseType: 'json' });
  }
}

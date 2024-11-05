import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PieceModel } from '../models/piece.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PieceService {
  private URL_API = 'http://localhost:8080/piece';

  constructor(private _http: HttpClient) { }

  getAllPieceImages(id: number): Observable<string[]> {
    return this._http.get<string[]>(`${this.URL_API}/${id}/images`, { responseType: 'json' });
  }
}

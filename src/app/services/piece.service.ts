import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PieceModel } from '../models/piece.model';
import { Observable } from 'rxjs';
import { ImageModel } from '../models/image.model';

@Injectable({
  providedIn: 'root'
})
export class PieceService {
  private URL_API = 'http://localhost:8080/piece';

  constructor(private _http: HttpClient) { }

  getAllPieceImages(id: number): Observable<ImageModel[]> {
    return this._http.get<ImageModel[]>(`${this.URL_API}/${id}/images`, { responseType: 'json' });
  }
}

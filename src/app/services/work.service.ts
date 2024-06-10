import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkModel } from '../models/work.model';
import { Observable } from 'rxjs';
import { PieceModel } from '../models/piece.model';

@Injectable({
  providedIn: 'root'
})
export class WorkService {
  private URL_API = 'http://localhost:8080/work';

  constructor(private _http: HttpClient) { }

  getAllWorks(): Observable<WorkModel[]> {
    return this._http.get<WorkModel[]>(`${this.URL_API}/`, { responseType: 'json' });
  }

  getWorkById(id: string): Observable<WorkModel> {
    return this._http.get<WorkModel>(`${this.URL_API}/${id}`, { responseType: 'json' });
  }
  
  // getAllWorkPieces(id: string): Observable<PieceModel[]> {
  //   return this._http.get<PieceModel[]>(`${this.URL_API}/${id}/pieces`, { responseType: 'json' });
  // }
}

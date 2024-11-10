import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkModel } from '../models/work.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkService {
  private URL_API = 'http://localhost:8080/work';

  constructor(private _http: HttpClient, private authService: AuthService) { }

  getAllWorks(): Observable<WorkModel[]> {
    return this._http.get<WorkModel[]>(`${this.URL_API}/`, { responseType: 'json' });
  }

  getWorkById(id: string): Observable<WorkModel> {
    return this._http.get<WorkModel>(`${this.URL_API}/${id}`, { responseType: 'json' });
  }

  addFavorite(userId: string, artworkId: string) {
    return this._http.post(`${this.URL_API}/fav`, {
      user_id: userId,
      artwork_id: artworkId
    }, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    })
      .pipe(
        tap(response => {
          console.log('Respuesta del servidor:', response);
        }),
        catchError(error => {
          console.error('Error al agregar favorito:', error);
          // Optionally, you can return a fallback value or rethrow the error
          return of({ error: true, message: 'Error al agregar favorito' });
        })
      );
  }
  toggleFavorite(userId: string, artworkId: string, shouldAdd: boolean) {
    return this._http.post(`${this.URL_API}/fav`, {
      user_id: userId,
      artwork_id: artworkId,
      shouldAdd: shouldAdd
    }, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    })
      .pipe(
        tap(response => {
          console.log('Respuesta del servidor:', response);
        }),
        catchError(error => {
          console.error('Error al agregar favorito:', error);
          // Optionally, you can return a fallback value or rethrow the error
          return of({ error: true, message: 'Error al agregar favorito' });
        })
      );
  }

 

  

}

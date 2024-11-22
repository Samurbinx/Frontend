import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtworkModel } from '../models/artwork.model';

@Injectable({
   providedIn: 'root'
})
export class ArtworkService {

   private URL_API = 'http://localhost:8080/artwork';

   constructor(private http: HttpClient) { }

   getArtwork(artwork_id: number): Observable<ArtworkModel> {
      return this.http.get<ArtworkModel>(`${this.URL_API}/${artwork_id}`);
   }
}

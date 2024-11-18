import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtworkModel } from '../models/artwork.model';
import { AddressModel } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private URL_API = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

   // -- GETTERS -- //
  getFavsId(user_id: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.URL_API}/user/${user_id}/favsid`);
  }
  getFavsArt(user_id: string): Observable<ArtworkModel[]> {
    return this.http.get<ArtworkModel[]>(`${this.URL_API}/user/${user_id}/favsart`);
  }
  getCartId(user_id: string): Observable<number> {
    return this.http.get<number>(`${this.URL_API}/user/${user_id}/cartId`);
  }
  getCarted(user_id: string): Observable<ArtworkModel[]> {
    return this.http.get<ArtworkModel[]>(`${this.URL_API}/user/${user_id}/carted`);
  }

  getCartLength(user_id: string):Observable<number> {
    return this.http.get<number>(`${this.URL_API}/user/${user_id}/cartlength`);
  }
  getAddress(user_id: string):Observable<AddressModel> {
    return this.http.get<AddressModel>(`${this.URL_API}/address/${user_id}`);
  }

}

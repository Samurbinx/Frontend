import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ArtworkModel } from '../models/artwork.model';
import { AddressModel } from '../models/address.model';
import { OrderModel } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private URL_API = 'http://localhost:8080';
  
  private cartLengthSource = new BehaviorSubject<number>(0);
  cartLength$ = this.cartLengthSource.asObservable();

  constructor(private http: HttpClient) { }
  
   // -- FAVS -- //
  getFavsId(user_id: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.URL_API}/user/${user_id}/favsid`);
  }
  getFavsArt(user_id: string): Observable<ArtworkModel[]> {
    return this.http.get<ArtworkModel[]>(`${this.URL_API}/user/${user_id}/favsart`);
  }

   // -- CART -- //
  getCartId(user_id: string): Observable<number> {
    return this.http.get<number>(`${this.URL_API}/user/${user_id}/cartId`);
  }
  getCarted(user_id: string): Observable<ArtworkModel[]> {
    return this.http.get<ArtworkModel[]>(`${this.URL_API}/user/${user_id}/carted`);
  }
  getCartLength(user_id: string):Observable<number> {
    return this.http.get<number>(`${this.URL_API}/user/${user_id}/cartlength`);
  }
  updateCartLength(newLength: number) {
    this.cartLengthSource.next(newLength);
  }


  // -- ORDERS -- //
  getOrders(user_id: string): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(`${this.URL_API}/user/${user_id}/orders`);
  }
  
  // -- ADDRESS -- //
  getAddress(user_id: string):Observable<AddressModel> {
    return this.http.get<AddressModel>(`${this.URL_API}/address/${user_id}`);
  }
  getAllAddress(user_id: string):Observable<AddressModel[]> {
    return this.http.get<AddressModel[]>(`${this.URL_API}/address/alladdress/${user_id}`);
  }

}

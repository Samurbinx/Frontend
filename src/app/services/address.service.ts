import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressModel } from '../models/address.model';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private URL_API = 'http://localhost:8080/address';

  constructor(private http: HttpClient) { }

  addAddress(address: AddressModel, user_id: string): any {
    return this.http.post(`${this.URL_API}/${user_id}/new`, address);
  }

  delAddress(address_id: string): any {
    return this.http.post(`${this.URL_API}/${address_id}/del`, address_id);
  }

 

}

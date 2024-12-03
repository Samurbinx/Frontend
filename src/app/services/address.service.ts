import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressModel } from '../models/address.model';
import { catchError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  
  // private URL_API = 'http://localhost:8080/address';
  private URL_API = `${environment.apiUrl}/address`;

  constructor(private http: HttpClient) { }

  addAddress(address: AddressModel, user_id: string): any {
    return this.http.post(`${this.URL_API}/${user_id}/new`, address);
  }
  editAddress(address:AddressModel): any {
    return this.http.post(`${this.URL_API}/${address.id}/edit`, address);
  }


  delAddress(address_id: number): any {
    return this.http.post(`${this.URL_API}/${address_id}/del`, address_id);
  }
 
  setDefault(address_id: number, user_id: string): any {
    return this.http.post(`${this.URL_API}/setdefault`, { address_id, user_id });
  }


}

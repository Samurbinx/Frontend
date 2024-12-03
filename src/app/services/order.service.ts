import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

interface OrderResponse {
  success: boolean;  // Indica si la creación de la orden fue exitosa
  message: string;   // Mensaje de éxito o error
  details?: any;     // Detalles adicionales del error (opcional)
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private URL_API = `${environment.apiUrl}/order`;

  // private URL_API = 'http://localhost:8080/order';

  constructor(private _http: HttpClient, private authService: AuthService) { }

  newOrder(orderData: any, paymentData: any): Observable<any> {
    return this._http.post<any>(`${this.URL_API}/new`, {
      orderData,
      paymentData
    });
  }
}

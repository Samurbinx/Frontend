import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

interface OrderResponse {
  success: boolean;  // Indica si la creación de la orden fue exitosa
  message: string;   // Mensaje de éxito o error
  details?: any;     // Detalles adicionales del error (opcional)
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private URL_API = 'http://localhost:8080/order';

  constructor(private _http: HttpClient, private authService: AuthService) { }

  newOrder(orderData: any, paymentData: any): Observable<any> {
    return this._http.post<any>(`${this.URL_API}/new`, {
      orderData,
      paymentData
    });
  }
}

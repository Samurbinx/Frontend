import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

interface OrderResponse {
  success: boolean;  // Indica si la creación de la orden fue exitosa
  error: boolean;    // Indica si hubo un error en la creación de la orden
  message: string;   // Mensaje de éxito o error
  details?: any;     // Detalles adicionales del error (opcional)
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private URL_API = 'http://localhost:8080/order';

  constructor(private _http: HttpClient, private authService: AuthService) { }

  newOrder(user_id: string, artworks: number[], total_amount: number, cart_id: number) {
    return this._http.post<OrderResponse>(`${this.URL_API}/new`, {
      user_id: user_id,
      artworks: artworks,
      total_amount: total_amount,
      cart_id: cart_id
    }, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    }).pipe(
      tap(response => {
        console.log('Respuesta del servidor:', response);
      }),
      catchError(error => {
        // Log the error to the console for debugging purposes
        console.error('Error al crear pedido:', error);
  
        // Retornar una respuesta detallada para el manejo del error
        return of({
          success: false,
          error: true,
          message: 'Error al crear pedido',
          details: error.message || 'Error desconocido'
        });
      })
    );
  }
  
}

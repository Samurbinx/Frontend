import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, of, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { error } from 'console';
import { ArtworkModel } from '../models/artwork.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private URL_API = 'http://localhost:8080/cart';
  public StripePublicKey = 'pk_test_51QL60A01qslkTUypDH7HjcBn7G0E22306bHTsSjDqsGNsK3LT04ipA6PeGp4IajYdwNcIqce2Fi8hgHf4oFCtfMA006sUUYNnq';

 
  
  constructor(private _http: HttpClient, private authService: AuthService) { }



  getTotalAmount(cartId: number): Observable<number> {
    return this._http.get<number>(`${this.URL_API}/${cartId}/total`);
  }
  updateTotalAmount(cartId: number, total: number): Observable<any> {
    // Validar parámetros antes de enviar la solicitud
    if (!cartId || typeof total !== 'number' || total < 0) {
      console.error('Datos inválidos antes de enviar la solicitud');
      return throwError(() => new Error('Datos inválidos para actualizar el monto total.'));
    }

    return this._http.post(`${this.URL_API}/update-amount`, {
      cart_id: cartId,
      total_amount: total,
    }).pipe(
      catchError((error) => {
        console.error('Error al actualizar el monto total:', error);
        return throwError(error); // Mantener el flujo original del error
      })
    );
  }


  addToCart(cartId: number, artworkId: number) {
    return this._http.post(`${this.URL_API}/addArtwork`, {
      cart_id: cartId,
      artwork_id: artworkId,
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
          console.error('Error al agregar al carrito:', error);
          // Optionally, you can return a fallback value or rethrow the error
          return of({ error: true, message: 'Error al agregar al carrito' });
        })
      );
  }

  delFromCart(cartId: number, artworkId: number) {
    return this._http.post(`${this.URL_API}/delArtwork`, {
      cart_id: cartId,
      artwork_id: artworkId
    }).pipe(
      tap(response => {
        console.log('Respuesta del servidor:', response);
      }),
      catchError(error => {
        console.error('Error al elimnar del carrito:', error);
        // Optionally, you can return a fallback value or rethrow the error
        return of({ error: true, message: 'Error al eliminar del carrito' });
      })
    );
  }

  toggleSelected(cartId: number, artworkId: number) {
    return this._http.post(`${this.URL_API}/toggleSelected`, {
      cart_id: cartId,
      artwork_id: artworkId
    }).pipe(
      tap(response => {
        console.log('Respuesta del servidor:', response);
      }),
      catchError(error => {
        console.error('Error al cambiar el select del carrito:', error);
        // Optionally, you can return a fallback value or rethrow the error
        return of({ error: true, message: 'Error al cambiar el select del carrito' });
      })
    );
  }
  isSelected(cartId: number, artworkId: number) {
    return this._http.get(`${this.URL_API}/isSelected/${cartId}/${artworkId}`);
  }
  getCartedSelected(cart_id: number): Observable<ArtworkModel[]> {
    return this._http.get<ArtworkModel[]>(`${this.URL_API}/${cart_id}/cartedselected`);
  }
  getCartArtworks(cart_id: number): Observable<ArtworkModel[]> {
    return this._http.get<ArtworkModel[]>(`${this.URL_API}/${cart_id}/getCartArtworks`).pipe(catchError(this.handleError));
  }
  createPaymentIntent(paymentData: { amount: number, currency: string }): Observable<{ client_secret: string }> {
    return this._http.post<{ client_secret: string }>(`${this.URL_API}/create-payment-intent`, paymentData);
  }
  cancelPaymentIntent(paymentData: { client_secret: string }): Observable<{ client_secret: string }> {
    return this._http.post<{ client_secret: string }>(`${this.URL_API}/cancel-payment-intent`, paymentData);
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
    }
    return throwError(errorMessage);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private URL_API = 'http://localhost:8080/cart';

  constructor(private _http: HttpClient, private authService: AuthService) { }

  addToCart(cartId: string, artworkId: string) {
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

  delFromCart(cartId: string, artworkId: number){
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
}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { catchError, Observable, tap, throwError, BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service'; // Importa el servicio combinado

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private URL_API = 'http://localhost:8080/user';
  private userSubject = new BehaviorSubject<UserModel | null>(this.getUser()); // Inicializa con el usuario en sessionStorage

  constructor(private _http: HttpClient, private storageService: StorageService) {}

  // Método para agregar un nuevo usuario
  addUser(user: UserModel): Observable<UserModel> {
    return this._http.post<UserModel>(`${this.URL_API}/new`, user).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Método para iniciar sesión
  login(email: string, pwd: string): Observable<{ token: string; user: UserModel }> {
    return this._http.post<{ token: string; user: UserModel }>(`${this.URL_API}/login`, { email, pwd }).pipe(
      tap(response => {
        this.setUser(response.user); // Almacena los datos del usuario en sessionStorage
        this.setToken(response.token); // Almacena el token en cookies
        this.userSubject.next(response.user); // Actualiza el BehaviorSubject
      }),
      catchError(this.handleError) // Agregar el manejo de errores
    );
  }

  // Métodos para gestionar el token en cookies
  setToken(token: string): void {
    this.storageService.setCookie('token', token, 7); // Usa el servicio para establecer el token en cookies
  }

  getToken(): string | null {
    return this.storageService.getCookie('token'); // Usa el servicio para obtener el token de cookies
  }

  // Verifica si el usuario está logueado
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }

  // Método para cerrar sesión
  logout(): void {
    this.storageService.removeCookie('token'); // Usa el servicio para eliminar el token de cookies
    this.clearUser(); // Limpia la información del usuario al cerrar sesión
    this.userSubject.next(null); // Notifica que el usuario ha cerrado sesión
  }

  // Manejo de usuario
  setUser(data: UserModel): void {
    this.storageService.setSessionItem('user', JSON.stringify(data)); // Almacena el usuario en sessionStorage
    this.userSubject.next(data); // Actualiza el BehaviorSubject
  }

  getUser(): UserModel | null {
    const user = this.storageService.getSessionItem('user'); // Obtiene el usuario de sessionStorage
    return user ? JSON.parse(user) : null; // Devuelve el objeto del usuario o null si no existe
  }

  clearUser(): void {
    this.storageService.removeSessionItem('user'); // Elimina el usuario de sessionStorage
    this.userSubject.next(null); // Notifica que no hay usuario
  }

  // Método para obtener un observable del usuario
  getUserObservable(): Observable<UserModel | null> {
    return this.userSubject.asObservable(); // Devuelve el observable del BehaviorSubject
  }

  // Manejo de errores centralizado
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred!';

    if (error.status === 0) {
      // Error de red o cliente
      errorMessage = 'Network error occurred. Please try again later.';
      console.error('An error occurred:', error.error);

    } else if (error.status === 500) {
      // Error del servidor
      errorMessage = 'Ya existe una cuenta con ese email.';
      console.error(`Backend returned code ${error.status}, message: ${errorMessage}`);

    } else {
      // Otros tipos de error
      errorMessage = `Error: ${error.status}, Message: ${error.message}`;
      console.error(`Backend returned code ${error.status}, message: ${errorMessage}`);
    }

    // Retornar un observable con un mensaje de error para el usuario
    return throwError(() => new Error(errorMessage));
  }
}

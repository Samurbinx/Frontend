import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private URL_API = 'http://localhost:8080/user';
  
  constructor(private _http: HttpClient) {
   }

  addUser(user: UserModel): Observable<UserModel> {
    return this._http.post<UserModel>(`${this.URL_API}/new`, user).pipe(
      catchError(this.handleError)
    )
  }

  login(email: string, pwd: string): Observable<string> {
    return this._http.post<string>(`${this.URL_API}/login`,{email,pwd});
  }

  setToken(token: string): void {
    // localStorage.setItem('token', token);
  }

  getToken(): any {
    // return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    // localStorage.removeItem('token');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';

    if (error.status === 0) {
      console.error('An error occurred:', error.error);

    } else {
      if (error.status === 500) {
        errorMessage = "Ya existe una cuenta con ese email";

      console.error(
        `Backend returned code ${error.status}, body was: `, errorMessage);
      }
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(errorMessage));
  }
}



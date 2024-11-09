import { UserModel } from './../models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';



interface LoginResponse {
  token: string;
  user: UserModel;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL_API = 'http://localhost:8080/user';
  private user: UserModel | null = null;

  constructor(private http: HttpClient, private storageService: StorageService) { }

  login(email: string, pwd: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.URL_API}/login`, { email, pwd })
      .pipe(
        tap(response => {
          // console.log(response);
          this.user = response.user;
          this.storageService.setCookie('token', response.token, 7);
        })
      );
  }

  logout(): void {
    this.storageService.removeCookie('token');
    this.user = null;
  }

  loginByToken(token: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.URL_API}/login-token`, { "token": token })
      .pipe(
        tap(response => {
          // console.log(response);
          this.user = response.user;
          this.storageService.setCookie('token', response.token, 7);
        })
      );
  }
  
  getToken() {
    let token = this.storageService.getCookie('token');
    return token;
  }

  getIdByToken(token: string): Observable<any> {
    return this.http.post<any>(`${this.URL_API}/getidbytoken`, { token })
      .pipe(
        tap(response => {
          // console.log(response);
        })
      );
  }
  addUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.URL_API}/new`, user).pipe(
      catchError(this.handleError)
    );
  }

  getFavs(user_id: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.URL_API}/${user_id}/favs`);
  }
 

  // Centralized error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred!';

    if (error.status === 0) {
      errorMessage = 'Network error occurred. Please try again later.';
      console.error('An error occurred:', error.error);

    } else if (error.status === 500) {
      errorMessage = 'An account with this email already exists.';
      console.error(`Backend returned code ${error.status}, message: ${errorMessage}`);

    } else {
      errorMessage = `Error: ${error.status}, Message: ${error.message}`;
      console.error(`Backend returned code ${error.status}, message: ${errorMessage}`);
    }

    return throwError(() => new Error(errorMessage));
  }
}

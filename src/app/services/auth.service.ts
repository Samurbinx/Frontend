import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UserModel } from '../models/user.model';
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
  user$ = new BehaviorSubject<UserModel | null>(null);  // Explicitly declare type


  constructor(private http: HttpClient, private storageService: StorageService) { }

  login(email: string, pwd: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.URL_API}/login`,  { email, pwd })
      .pipe(
        tap(response => {
          console.log(response);
          this.user$.next(response.user);
          this.setToken(response.token);
        })
      );
  }

  logout(): void {
    this.storageService.removeCookie('token');
    this.user$.next(null);
  }

  getCurrentUser(): Observable<UserModel> {
    return this.user$.pipe(
      switchMap(user => {
        // If user exists, return it
        if (user) {
          return of(user);
        }
  
        const token = this.storageService.getCookie('token');
        // If there is a token, fetch the current user
        if (token) {
          return this.fetchCurrentUser();
        }
  
        // If no user and no token, return null, but filter out null values later
        return of(null);
      }),
      filter((user): user is UserModel => user !== null) // Ensure user is not null
    );
  }

  fetchCurrentUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.URL_API}/current-user`)
      .pipe(
        tap(user => {
          this.user$.next(user);
        })
      );
  }

  addUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.URL_API}/new`, user).pipe(
      catchError(this.handleError)
    );
  }



  private setToken(token: string): void {
    this.storageService.setCookie('token', token, 7);
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

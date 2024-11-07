import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { catchError, Observable, tap, throwError, BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private URL_API = 'http://localhost:8080/user';
  private userSubject: BehaviorSubject<UserModel | null> = new BehaviorSubject<UserModel | null>(null);
  private isLoggedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private _http: HttpClient, private storageService: StorageService) { }

    // --- USER MANAGEMENT --- /
  // User management methods
  setUser(user: UserModel): void {
    this.userSubject.next(user); // Emit the new user data to subscribers
  }

  getUser(): UserModel | null {
    return this.userSubject.value; // Access the current value of the user
  }

  // Observable to expose the user data to other components
  get user$(): Observable<UserModel | null> {
    return this.userSubject.asObservable();
  }

  // Adds a new user
  addUser(user: UserModel): Observable<UserModel> {
    return this._http.post<UserModel>(`${this.URL_API}/new`, user).pipe(
      catchError(this.handleError)
    );
  }

    // --- LOG MANAGEMENT --- //
  login(email: string, pwd: string): Observable<{ token: string; user: UserModel }> {
    return this._http.post<{ token: string; user: UserModel }>(`${this.URL_API}/login`, { email, pwd }).pipe(
      tap(response => {
        this.setUser(response.user);
        this.setToken(response.token); // Store token in cookies
        this.isLoggedSubject.next(true);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.storageService.removeCookie('token');
    this.isLoggedSubject.next(false);
    this.userSubject.next(null);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedSubject.asObservable();
  }

  get isLoggedIn$(): Observable<boolean | null> {
    return this.isLoggedSubject.asObservable();
  }

  // --- TOKEN MANAGEMENT --- /
  setToken(token: string): void {
    this.storageService.setCookie('token', token, 7); // 7 days
  }

  getToken(): string | null {
    return this.storageService.getCookie('token');
  }

  hasToken(): boolean {
    return !!this.storageService.getCookie('token');
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

import { UserService } from './user.service';
import { UserModel } from './../models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { ArtworkModel } from '../models/artwork.model';



interface LoginResponse {
  token: string;
  user: UserModel;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private URL_API = 'http://localhost:8080/user';
  private user: UserModel | null = null;

  private userSubject = new BehaviorSubject<UserModel | null>(null);
  private logged = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private storageService: StorageService, private userService: UserService) { }

  getUserSubject() {
    return this.userSubject.asObservable();
  }
  isLoggedSubject(){
    return this.logged.asObservable();
  }
  login(email: string, pwd: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.URL_API}/login`, { email, pwd })
      .pipe(
        tap(response => {
          this.storageService.setCookie('token', response.token, 7);
          this.storageService.setSessionItem('logged', "true");
          this.storageService.setSessionItem('user_id', response.user_id);
          this.logged.next(true);
          const user = new UserModel(
            response.user.email,
            "",
            response.user.name,
            response.user.surname,
            response.user.nick,
            response.user.phone,
            response.user.address
          )
          this.user = user;
          this.userSubject.next(user);

        })
      );
  }

  logout() {
    this.storageService.removeCookie('token');
    this.storageService.removeSessionItem('logged');
    this.storageService.removeSessionItem('user_id');
    this.user = null;
    this.userSubject.next(null);
    this.logged.next(false);
    window.location.reload();
  }

  loginByToken(token: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.URL_API}/login-token`, { "token": token })
      .pipe(
        tap(response => {
          this.storageService.setCookie('token', response.token, 7);
          this.storageService.setSessionItem('logged', "true");
          this.storageService.setSessionItem('user_id', response.user_id);
          this.logged.next(true);
          const user = new UserModel(
            response.user.email,
            "",
            response.user.name,
            response.user.surname,
            response.user.nick,
            response.user.phone,
            response.user.address,
          )
          this.user = user;
          this.userSubject.next(user);
        })
      );
  }
  

  
  addUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.URL_API}/new`, user).pipe(
      catchError(this.handleError)
    );
  }
  getUser(){
    return this.user;
  }
  updateUser(user: any, user_id: string): any {
    return this.http.post<any>(`${this.URL_API}/update/${user_id}`, user);
  }
  updatePwd(data: any, user_id: string): any {
    return this.http.post<any>(`${this.URL_API}/updatepwd/${user_id}`, data);
  }
  getUserById(id: any): Observable<UserModel>{
    return this.http.get<UserModel>(`${this.URL_API}/${id}`);
  }
  getUserSafeById(id: any): Observable<UserModel>{
    return this.http.get<UserModel>(`${this.URL_API}/${id}`, { responseType: 'json' });
  }
  getUserId(){
    return this.storageService.getSessionItem('user_id');
  }
  getToken(): string | null {
    return this.storageService.getCookie('token');
  }
  islogged(){
    return !!this.storageService.getSessionItem('logged');
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class MessageService {
  
  // private URL_API = 'http://localhost:8080/contact';
  private URL_API = `${environment.apiUrl}/contact`;

  constructor(private _http: HttpClient) { }

  sendMessage(body: any) {
    return this._http.post(this.URL_API, body);
  }
}
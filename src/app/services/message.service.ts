import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class MessageService {
  
  private apiUrl = 'http://localhost:8080/contact';

  constructor(private _http: HttpClient) { }

  sendMessage(body: any) {
    return this._http.post(this.apiUrl, body);
  }
}
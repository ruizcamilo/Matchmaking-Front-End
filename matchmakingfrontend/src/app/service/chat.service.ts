import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Chat } from '../model/chat';
import { Mensaje } from '../model/mensaje';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  constructor(private afStore: AngularFirestore,private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.log(error);
    return throwError('An error has occurred');
  }

  getToken() {
    return sessionStorage.getItem('token');
  }
  
  private get<T>(url): Observable<T> {
    console.log('get:', url);
    return this.http
      .get<T>(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Firebase-Auth': this.getToken(),
        }),
      })
      .pipe(
        // retry(5),
        catchError(this.handleError)
      );
    }

    private post2<T>(url, data: T): Observable<T> {
    console.log('post:', url);
    return this.http
      .post<T>(url, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Firebase-Auth': this.getToken(),
        }),
      })
      .pipe(catchError(this.handleError));
    }
  private post<T>(url, data: T, idChat: string): Observable<T> {
    console.log('post:', url);
    return this.http
    .post<T>(url, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Chat-id': idChat,
          'X-Firebase-Auth': this.getToken(),
        }),
      })
      .pipe(catchError(this.handleError));
  }
  
  private put<T>(url, data: T): Observable<T> {
    console.log('put:', url);
    return this.http
    .put<T>(url, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Firebase-Auth': this.getToken(),
        }),
      })
      .pipe(catchError(this.handleError));
  }
  
  private delete<T>(url): Observable<T> {
    console.log('delete:', url);
    return this.http
    .delete<T>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Firebase-Auth': this.getToken(),
      }),
    })
    .pipe(
      catchError(this.handleError)
      );
    }

  createChat(data: Chat) {
    const url = `${environment.logedInServiceBaseUrl}/chat/create`;
    return this.post2(url, data);
  }
  
  getChats(){
    const url = `${environment.logedInServiceBaseUrl}/chats`;
    return this.get<Chat[]>(url);
  }
  getChatById(idChat : string){
    const url = `${environment.logedInServiceBaseUrl}/chat/${idChat}`;
    return this.get<Chat>(url);
  }
  sendMessage(message: Mensaje, idChat: string){
    console.log("--------" + message.mensaje + "--------->" + message.fechayhora + "-----" + message.id + "----" + message.remitente);
    
    const url = `${environment.logedInServiceBaseUrl}/chat/message`;
    return this.post<Mensaje>(url, message, idChat);
  }
}

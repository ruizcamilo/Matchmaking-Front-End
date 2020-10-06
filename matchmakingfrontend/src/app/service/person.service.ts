import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { tokenName } from '@angular/compiler';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }
  
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

  private post<T>(url, data: T): Observable<T> {
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

  //Amigos jugando
  getFriends() {
      const url = `${environment.userServiceBaseUrl}/play/friends`; // Falta dirección URL
      return this.get(url);
  }
  
  getFriendsChat() {
    const url = `${environment.userServiceBaseUrl}/play/friends`; // Falta dirección URL
    return this.get(url);
  }

}

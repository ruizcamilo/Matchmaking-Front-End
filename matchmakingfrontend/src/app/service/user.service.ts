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
import { User } from '../model/user';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient, private cookies: CookieService) { }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.log(error);
    return throwError('An error has occurred');
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

  register(usuario: User) {
    const url = `${environment.userServiceBaseUrl}/register`;
    console.log(usuario.nombres);
    return this.http
      .post<User>(url, usuario, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }
  getToken() {
    return sessionStorage.getItem('token');
  }
  updateUser(usuario: User) {
    const url = `${environment.userServiceBaseUrl}/play/edit/profile`;
    return this.put(url, usuario);
  }
  findByToken() {
    const url = `${environment.userServiceBaseUrl}/play/edit/profile`;
    return this.get(url);
  }
  findById(id: string) {
    const url = `${environment.userServiceBaseUrl}/play/profile/${id}`;
    return this.get(url);
  }
  reportById(id: string) {
    const url = `${environment.userServiceBaseUrl}/play/profile/report/${id}`;
    return this.put(url, {});
  }
  addFriendById(id: string) {
    const url = `${environment.userServiceBaseUrl}/play/profile/add/${id}`;
    return this.post(url, {});
  }
  deleteFriendById(id: string) {
    const url = `${environment.userServiceBaseUrl}/play/profile/delete/${id}`;
    return this.delete(url);
  }
  isFriend(id: string) {
    const url = `${environment.userServiceBaseUrl}/play/profile/isFriend/${id}`;
    return this.get(url);
  }
  isRequestSend(id: string) {
    const url = `${environment.userServiceBaseUrl}/play/profile/isRequestSend/${id}`;
    return this.get(url);
  }
  uploadFile(fileToUpload: FormData): Observable<any> {
    const url = `${environment.userServiceBaseUrl}/play/upload`;
    return this.http
      .post<any>(url, fileToUpload, {
        headers: new HttpHeaders({
          'X-Firebase-Auth': this.getToken(),
        }),
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  searchUser(searchKey: string) {
    const url = `${environment.userServiceBaseUrl}/play/search/` + searchKey;
    return this.get(url);
  }
}

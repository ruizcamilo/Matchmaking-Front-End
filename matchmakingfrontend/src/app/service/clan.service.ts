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
import { tokenName } from '@angular/compiler';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup } from '@angular/forms';
import { Post } from '../model/post';
import { Comment } from '../model/comment';
import { Clan } from '../model/clan';
import { Person } from '../model/person';



@Injectable({
  providedIn: 'root'
})
export class ClanService {
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

    private postNomClan<T>(url, data: T, clan: string): Observable<T> {
      console.log('post:', url);
    return this.http
      .post<T>(url, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Firebase-Auth': this.getToken(),
          'nombre_clan': clan,
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

  private deleteConNombreClan<T>(url, nomClan: string): Observable<T> {
    console.log('delete:', url);
    return this.http
    .delete<T>(url, {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Firebase-Auth': this.getToken(),
          'nombre_clan': nomClan,
          Accept: 'application/json',
        }),
      })
      .pipe(
        catchError(this.handleError)
      );
    }

    searchClan(search: string) {
    const url = `${environment.userServiceBaseUrl}/play/search/clans/${search}`;
    return this.get(url);
  }

  getMyClans() {
    const url = `${environment.userServiceBaseUrl}/play/clans`;
    return this.get(url);
  }

  leaveClan() {

  }

  makeClan(nuevoClan: Clan) {
    const url = `${environment.logedInServiceBaseUrl}/clan/create`;
    return this.post<Clan>(url, nuevoClan);
  }
  getPosts(nombreClan: string) {
    const url = `${environment.logedInServiceBaseUrl}/clan/posts/${nombreClan}`;
    return this.get<Post[]>(url);
  }
  makePost(post: Post, clan: string) {
    const url = `${environment.logedInServiceBaseUrl}/clan/add/post`;
    return this.postNomClan<Post>(url, post, clan);
  }

  isMember(nombre_clan: string) {
    const url = `${environment.userServiceBaseUrl}/play/clan/isMember/${nombre_clan}`;
    return this.get(url);
  }

  isRequestSend(nombre_clan: string) {
    const url = `${environment.userServiceBaseUrl}/play/clan/isRequestSend/${nombre_clan}`;
    return this.get(url);
  }

  requestToClan(nombre_clan: string) {
    const url = `${environment.logedInServiceBaseUrl}/clan/request/${nombre_clan}`;
    return this.post(url, {} );
  }

  getMembersOf(nombre_clan: string) {
    const url = `${environment.userServiceBaseUrl}/play/clan/persons/${nombre_clan}`;
    return this.get(url);
  }

  getRefugeesOf(nombre_clan: string) {
    const url = `${environment.userServiceBaseUrl}/play/clan/requests/${nombre_clan}`;
    return this.get(url);
  }

  /* aceptar solictud */
  shelter(refujiado: Person, clan: string) {
    const url = `${environment.logedInServiceBaseUrl}/clan/add/person/`;
    return this.postNomClan(url,refujiado, clan);
  }

  isAdmin(nom_clan: string) {
    const url = `${environment.logedInServiceBaseUrl}/clan/isAdmin/${nom_clan}`;
    return this.get<boolean>(url);
  }

  /*
   * Delete de  mierda
   */

  exile(exMiembro: Person, nombre_clan: string) { //SE DEBE MIRAR

    const url = `${environment.logedInServiceBaseUrl}/clan/delete/${exMiembro.persona_id}`;
    return this.deleteConNombreClan(url, nombre_clan);
  }

  abandonRefugee(refujiado: Person, nombre_clan: string) {
    const url = `${environment.logedInServiceBaseUrl}/clan/deleterequest/${refujiado.persona_id}`;
    return this.deleteConNombreClan(url, nombre_clan);

  }
}

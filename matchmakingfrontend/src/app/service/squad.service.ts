import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Person } from '../model/person';
import { Squad } from '../model/squad';

@Injectable({
  providedIn: 'root'
})
export class SquadService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.log(error);
    return throwError('An error has occurred');
  }

  private getToken() {
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

  create(sendSquad: Squad) {
    const url = `${environment.logedInServiceBaseUrl}/squads/create`;
    return this.post(url,sendSquad);
  }
  sendInvitations(invitedFriends: string[], nombreSquad:string, idSquad){
    const url = `${environment.logedInServiceBaseUrl}/squads/invitations`;
    return this.http
    .post<string>(url, invitedFriends, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Firebase-Auth': this.getToken(),
        'nombreSquad' : nombreSquad,
        'idSquad': idSquad
      }),
    })
    .pipe(catchError(this.handleError));
  }
  getSquad(id_squad: string) {
    const url = `${environment.logedInServiceBaseUrl}/squads/${id_squad}`;
    return this.get<Squad>(url);
  }
  getIntegrantes(id_squad: string) {
    const url = `${environment.logedInServiceBaseUrl}/squads/members/${id_squad}`;
    return this.get<Person[]>(url);
  }
  getFriendsSquads() {
    const url = `${environment.logedInServiceBaseUrl}/squads/friends`;
    return this.get<Squad[]>(url);
  }
  getMySquads() {
    const url = `${environment.logedInServiceBaseUrl}/squads/mysquads/`;
    return this.get<Squad[]>(url);
  }
  updateSquad(sendSquad: Squad)
  {
    const url = `${environment.logedInServiceBaseUrl}/squads/mysquads/update/`;
    return this.put(url, sendSquad);
  }
  join(squad: Squad) {
    const url = `${environment.logedInServiceBaseUrl}/squads/join/`;
    return this.put(url, squad);
  }
  leaveSquad(squad: Squad){
    const url = `${environment.logedInServiceBaseUrl}/squads/exit/`;
    return this.put(url, squad);
  }
  acceptSquad(s: Squad) { //revisar
    const url = `${environment.logedInServiceBaseUrl}/squads/acceptInvite`;
    return this.put(url, s);
  }
  rejectSquad(id_squad: any) { //revisar
    const url = `${environment.logedInServiceBaseUrl}/squads/rejectInvite/${id_squad}`;
    return this.delete(url);
  }
}

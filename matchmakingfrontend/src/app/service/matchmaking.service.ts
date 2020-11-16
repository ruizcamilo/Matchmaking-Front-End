import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Matchmaking } from '../model/matchmaking';

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {

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

  create(matchmaking: Matchmaking){
    const url = `${environment.logedInServiceBaseUrl}/matchmaking/create`;
    return this.post(url, matchmaking);
  }
  match(matchmaking: Matchmaking){
    const url = `${environment.logedInServiceBaseUrl}/matchmaking/match`;
    return this.http
      .post<Matchmaking[]>(url, matchmaking, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Firebase-Auth': this.getToken(),
        }),
      })
      .pipe(catchError(this.handleError));
  }
  delete(){
    const url = `${environment.logedInServiceBaseUrl}/matchmaking/delete`;
    return this.post(url, {});
  }
}

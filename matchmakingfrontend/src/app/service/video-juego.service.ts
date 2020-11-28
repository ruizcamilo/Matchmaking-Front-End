import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { VideoJuego } from '../model/video-juego';

@Injectable({
  providedIn: 'root'
})
export class VideoJuegoService {
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

  private delete<T>(url, nombreJuego, imagenJuego): Observable<T> {
    console.log('delete:', url);
    return this.http
      .delete<T>(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Firebase-Auth': this.getToken(),
          'gameName': nombreJuego,
          'image': imagenJuego,
        }),
      })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllGames()
  {
    const url = `${environment.userServiceBaseUrl}/games`;
    console.log(url);
    return this.http.get<VideoJuego[]>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    })
    .pipe(
      // retry(5),
      catchError(this.handleError)
    );
  }

  searchGameTitle(searchKey: string) {
    const url = `${environment.logedInServiceBaseUrl}/search/games/` + searchKey;
    return this.get<VideoJuego[]>(url);
  }

  deleteGame(searchKey: VideoJuego)
  {
    console.log( searchKey.imagen);
    const url = `${environment.logedInServiceBaseUrl}/games/delete`;
    return this.delete<VideoJuego>(url, searchKey.nombre, searchKey.imagen);
  }
  
  modificarGame(searchKey: VideoJuego, anterior: String) {
    const url = `${environment.logedInServiceBaseUrl}/games/update/${anterior}`;
    return this.put<VideoJuego>(url, searchKey );
  }
  
  makeGame(game: VideoJuego) {

    const url = `${environment.logedInServiceBaseUrl}/games/new`;
    return this.post<VideoJuego>(url, game);
  }  
}

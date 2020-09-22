import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "../model/user";
import { tokenName } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  private handleError(error: HttpErrorResponse): Observable<any> {
    console.log(error);
    return throwError("An error has occurred");
  }

  private get<T>(url): Observable<T> {
    console.log("get:", url);
    return this.http
      .get<T>(url, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Accept: "application/json"
        })
      })
      .pipe(
        // retry(5),
        catchError(this.handleError)
      );
  }

  private post<T>(url, data: T): Observable<T> {
    console.log("post:", url);
    return this.http
      .post<T>(url, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      })
      .pipe(
        // retry(5),
        catchError(this.handleError)
      );
  }
  private put<T>(url, data: T): Observable<T> {
    console.log("put:", url);
    return this.http.put<T>(url, data).pipe(
      // retry(5),
      catchError(this.handleError)
    );
  }

  login(token: string, tokenName: string) {
    const formHeaders = new HttpHeaders();
    formHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    const formParams = new HttpParams()
      .set(tokenName, token);
    return this.http.post("http://localhost:8080/login", null, {
      headers: formHeaders,
      params: formParams,
      withCredentials: true
    });
  }

  logout() {
    return this.http.post('http://localhost:8080/logout', '', {
      withCredentials: true
    });
  }

  register(usuario: User) {
    const url = `${environment.userServiceBaseUrl}/register`;
    return this.post(url, {
      apellidos: usuario.apellidos,
      calificacion: usuario.calificacion,
      conexion: usuario.conexion,
      contrasena: usuario.contrasena,
      correo: usuario.correo,
      fecha_nacimiento: usuario.fecha_nacimiento,
      foto_perfil: usuario.foto_perfil,
      jugando_id: usuario.jugando_id,
      nombre_usuario: usuario.nombre_usuario,
      nombres: usuario.nombres,
      region_id: usuario.region_id,
      reportado: usuario.reportado
    });
  }

  /*findById(
    username: string // : Observable<Bus>
  ) {
    const url = `${environment.userServiceBaseUrl}/public/usuarios/${username}`;
    return this.get<User>(url);
  }

  findAll() {
    const url = `${environment.userServiceBaseUrl}/public/usuarios`;
    return this.get<User[]>(url);
  }

  create(usu: User) {
    const url = `${environment.userServiceBaseUrl}/public/usuarios`;
    return this.post(url, {
      apellidos: usu.apellidos,
      calificacion: usu.calificacion,
      conexion: usu.conexion,
      contrasena: usu.contrasena,
      correo: usu.correo,
      fecha_nacimiento: usu.fecha_nacimiento,
      foto_perfil: usu.foto_perfil,
      jugando_id: usu.jugando_id,
      nombre_usuario: usu.nombre_usuario,
      nombres: usu.nombres,
      region_id: usu.region_id,
      reportado: usu.reportado
    });
  }*/
}

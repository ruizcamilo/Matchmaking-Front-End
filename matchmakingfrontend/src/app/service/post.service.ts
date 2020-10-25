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


@Injectable({
  providedIn: 'root'
})
export class PostService {
    
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
  getPosts() {
    const url = `${environment.logedInServiceBaseUrl}/feed`;
    return this.get<Post[]>(url);
  }

  getMyPosts(mail){
    const url = `${environment.logedInServiceBaseUrl}/posts/${mail}`;
    return this.get<Post[]>(url);
  }

  searchPost(searchKey: string) {
    const url = `${environment.logedInServiceBaseUrl}/search/posts/` + searchKey;
    return this.get(url);
  }
  makePost(post: Post){
    const url = `${environment.logedInServiceBaseUrl}/post`;
    return this.post<Post>(url, post);
  }
  makeComment(comment: Comment){
    const url = `${environment.logedInServiceBaseUrl}/comments`;
    return this.post<Comment>(url, comment);
  }
  like(idPost: string){
    const url = `${environment.logedInServiceBaseUrl}/like/` + idPost;
    return this.post(url, null);
  }

  getLikes(idPost: string){
    const url = `${environment.logedInServiceBaseUrl}/likes/` + idPost;
    return this.get<number>(url);
  }

  getPostsReported() {
    const url = `${environment.userServiceBaseUrl}/play/manage/posts`;
    return this.get(url);
  }

  discardDeletePostById(idPost: string) {
    const url = `${environment.userServiceBaseUrl}/play/manage/posts/unreport/` + idPost;
    return this.put(url, {}); 
  }
  deletePostById(idPost: string) {
    const url = `${environment.userServiceBaseUrl}/play/manage/posts/delete/` + idPost;
    console.log("urlPost " + url);
    return this.delete(url); 
  }

  reportar(idPost: string){
    const url = `${environment.logedInServiceBaseUrl}/post/report/` + idPost;
    return this.post(url, null);
  }

  getComments(idPost: string){
    const url = `${environment.logedInServiceBaseUrl}/comments/` + idPost; //REVISAR URL
    return this.get<Comment[]>(url);
  }
}
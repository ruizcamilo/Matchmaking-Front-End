import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GuardAccesGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router ){}

  canActivate(): boolean {
    // If the user is not logged in we'll send them back to the home page
    if (sessionStorage.length == 0) {
      console.log('No estás logueado');
      this.router.navigate(['/presentation']);
      return false;
    }else if (sessionStorage.length == 1 || sessionStorage.length == 2){
      console.log('No estás logueado');
      sessionStorage.clear();
      this.router.navigate(['/presentation']);
      return false;
    }
    return true;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}

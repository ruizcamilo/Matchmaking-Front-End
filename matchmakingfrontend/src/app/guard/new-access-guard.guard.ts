import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewAccessGuardGuard implements CanActivate {
  constructor(private router: Router ){}

  canActivate(): boolean {
    // If the user is not an admin we'll send them back to the home page
    if (sessionStorage.length >= 4) {
      console.log('Ya estás logueado');
      this.router.navigate(['/feed']);
      return false;
    }
    return true;
  }

}

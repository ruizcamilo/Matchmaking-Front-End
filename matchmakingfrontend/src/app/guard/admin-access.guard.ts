import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAccessGuard implements CanActivate {
  constructor(private router: Router ){};

  canActivate(): boolean {
    // If the user is not an admin we'll send them back to the home page
    if (sessionStorage.getItem('isAdmin') != 'yes') {
      console.log('No eres admin');
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
  
}

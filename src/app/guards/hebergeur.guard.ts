import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Importez votre service d'authentification

@Injectable({
  providedIn: 'root'
})
export class HebergeurGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userRole = this.authService.getCurrentUserRole(); // Utilisez getCurrentUserRole() pour obtenir le rôle

    if (userRole === 'HEBERGEUR') {
      return true;
    } else {
      this.router.navigate(['/login']); // Rediriger vers la page de login si l'utilisateur n'est pas hébergeur
      return false;
    }
  }
}

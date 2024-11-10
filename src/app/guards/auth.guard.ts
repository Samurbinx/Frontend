import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';  // Suponiendo que tienes un servicio de autenticación
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.islogged()) {
      return true;  // Permite el acceso si el usuario está logueado
    } else {
      this.router.navigate(['/home']);  // Redirige a la página de login si no está logueado
      this.snackBar.open('Por favor inicie sesión', '', { duration: 3000 });
      return false;
    }
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserModel } from '../../../models/user.model';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  isLoggedIn = false;
  user: UserModel | null = null;

  constructor(private authService: AuthService,
              private router: Router,
              private storageService: StorageService) {}

  ngOnInit(): void {
    let token = this.storageService.getCookie('token');
    if (token) {
      // Llamamos al loginByToken y suscribimos a la respuesta
      this.authService.loginByToken(token).subscribe(
        (response) => {
          console.log('Login successful', response);
          this.user = response.user;
          this.isLoggedIn = true;
          this.router.navigate(['/home']); // Redirigimos a la página de inicio o dashboard
        },
        (error) => {
          console.error('Error during login', error);
          // Manejar error de sesión o token inválido
        }
      );
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { UserService } from './../../../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserModel } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';
import { subscribe } from 'diagnostics_channel';
import { MatBadgeModule } from '@angular/material/badge';
import bootstrap from 'bootstrap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule, MatBadgeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logged = false;
  user: UserModel | null = null;
  cart_length: number | null = 0;
  user_id: string | null = null;

  pages = [
    { label: 'Proyectos', link: '/proyectos', icon: 'dashboard' },
    { label: 'Contacto', link: '/contacto', icon: 'contact_page' },
    { label: 'Sobre mí', link: '/sobremi', icon: 'info' },
    // { label: 'Carrito', link: '/carrito', icon: 'local_mall' }
];


  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    private userService: UserService,
  ) { }
  
  
  ngOnInit(): void {
    this.authService.isLoggedSubject().subscribe(
      (response) => {
        this.logged = response;
        if (this.logged) {
          this.authService.getUserSubject().subscribe(
            (response) => {
              this.user = response
              this.getCartLength();
            }
          )
        }
        if (!this.logged) {
          const token = this.storageService.getCookie('token');
          if (token) {
            this.authService.loginByToken(token).subscribe(
              (response) => {
                this.user = response.user;
                this.logged = true;
              },
              (error) => {
                console.error('Error during login', error);
              }
            );
          } 
          let cart = this.storageService.getOfflineCart().length;
          this.userService.updateCartLength(cart)
          this.userService.cartLength$.subscribe(length => {
            this.cart_length = length;
          });
        }
        
      }
    )
  }


  
  getCartLength() {
    this.user_id = this.storageService.getSessionItem('user_id');
    if (this.user_id) {
      this.userService.getCartLength(this.user_id).subscribe({
        next: (length: number) => this.userService.updateCartLength(length), // Actualizar el observable con el valor inicial
        error: (err) => console.error('Error al cargar el tamaño del carrito:', err),
      });
      this.userService.cartLength$.subscribe(length => {
        this.cart_length = length;
      });
    }
  }
  
  logout(): void {
    this.authService.logout();
  }

}

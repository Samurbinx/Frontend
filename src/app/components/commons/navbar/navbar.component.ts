import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserModel } from '../../../models/user.model';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  isLoggedIn = false;
  user: UserModel | null = null;  // Guardar el usuario
  private userSubscription!: Subscription;  // Suscripción

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribirse al observable user$ del authService
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;  // Asigna el usuario a la propiedad
    });
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción al destruir el componente
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  logout(): void {
    this.authService.logout();
  }
}

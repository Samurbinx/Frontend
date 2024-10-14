import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false; // Inicializar como false
  user: UserModel | null = null; // Para almacenar los datos del usuario

  constructor(private $userservice: UserService) {}

  ngOnInit(): void {
    // Suscribirse al observable del estado de inicio de sesión
    this.$userservice.getUserObservable().subscribe(user => {
      this.user = user; // Actualiza los datos del usuario
      this.isLoggedIn = !!user; // Verifica si hay un usuario autenticado
    });
  }

  logout(): void {
    this.$userservice.logout();
    // No es necesario recargar la página; los cambios se reflejarán automáticamente
    this.user = null; // Limpiar los datos del usuario localmente
    this.isLoggedIn = false; // Actualizar el estado de inicio de sesión
  }
}

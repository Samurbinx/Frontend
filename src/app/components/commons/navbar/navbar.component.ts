import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserModel } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logged = false;
  user: UserModel | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
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
  }

  logout(): void {
    this.authService.logout();
  }

}

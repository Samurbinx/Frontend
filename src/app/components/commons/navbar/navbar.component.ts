import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  user: UserModel | null = null;
  private userSubscription: Subscription | null = null;
  private isLoggedSubject: Subscription | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Subscribe to the user observable to get user data and login status reactively
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.user = user;
      console.log(this.user);
    });
    this.isLoggedSubject = this.userService.isLoggedIn$.subscribe(logged => {
      this.isLoggedIn = !!logged;
    });
  }

  logout(): void {
    this.userService.logout();
    // User and login status will be updated automatically through the observable subscription
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.isLoggedSubject?.unsubscribe();
  }
}

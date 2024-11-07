import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms'

// LOCAL
import { FooterComponent } from './components/commons/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/commons/navbar/navbar.component';
import { MessageService } from './services/message.service';
import { UserService } from './services/user.service';
import { UserModel } from './models/user.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    NavbarComponent, 
    HomeComponent, 
    FooterComponent, 
    MatIconModule,
    FormsModule
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'Frontend';

  isLoggedIn = false;
  user: UserModel | null = null;
  private userSubscription: Subscription | null = null;
  private isLoggedSubscription: Subscription | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.user$.subscribe(user => {
      this.user = user;
    });

    const token = this.userService.getToken(); // Retrieve token once
    if (token) {
        this.userService.loginWithToken().subscribe({
          next: response => console.log('User logged in', response),
          error: err => console.error('Login failed', err)
        });
      }
    }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.isLoggedSubscription?.unsubscribe();
  }
  
}

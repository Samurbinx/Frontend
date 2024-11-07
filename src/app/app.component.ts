import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms'

// LOCAL
import { FooterComponent } from './components/commons/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/commons/navbar/navbar.component';
import { MessageService } from './services/message.service';
import { UserModel } from './models/user.model';
import { Observable, share, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';


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

export class AppComponent implements OnInit {
  user$: Observable<UserModel> = new Observable();
  user: UserModel | null = null;

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.user$ = this.authService.getCurrentUser().pipe(share());
    this.user$.subscribe((user: UserModel) => {
      this.user = user;  // Assign the user to the component's `user` property
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

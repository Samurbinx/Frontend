import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms'

// LOCAL
import { FooterComponent } from './components/commons/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/commons/navbar/navbar.component';
import { MessageService } from './services/message.service';


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

export class AppComponent {
  title = 'Frontend';

}
